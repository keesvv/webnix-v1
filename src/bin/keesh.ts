import { exec } from "../kernel/exec";
import { FileNotFoundError } from "../kernel/fs";
import { Executable } from "../lib/exec";
import { open } from "../lib/fs";
import { fprint, readall, readline } from "../lib/io";
import { btostr } from "../lib/strconv";

export class Keesh extends Executable {
  private parsePath(): string[] {
    return this.env.get("PATH")!.split(":");
  }

  private async locateBinary(input: string): Promise<string> {
    for (const pathEntry of ["", ...this.parsePath()]) {
      try {
        let fullPath = input;

        if (pathEntry !== "") {
          fullPath = pathEntry + "/" + input;
        }

        await open(fullPath, 0);
        return fullPath;
      } catch (error) {
        if (error instanceof FileNotFoundError) {
          continue;
        }
        throw error;
      }
    }

    throw new FileNotFoundError();
  }

  private async execute(argv: string[]) {
    try {
      await exec(argv[0], argv.slice(1), this.stdio, this.env);
    } catch (error) {
      fprint(this.stdio.stderr, "invalid executable\n");
    }
  }

  async main(): Promise<number> {
    this.env.set("PATH", "/bin");

    while (true) {
      fprint(this.stdio.stdout, this.env.get("PS1") ?? "");
      const ln = this.env.expand(await readline(this.stdio.stdin));

      if (!ln.length || ln.startsWith("#")) {
        continue;
      }

      // TODO: refactor
      if (ln === "exit") {
        return 0;
      }

      const args = ln.split(" ");
      if (args[0] === "echo") {
        fprint(this.stdio.stdout, args.slice(1).join(" ") + "\n");
        continue;
      }

      if (args[0] === "export") {
        const [key, value] = args.slice(1).join(" ").split("=");
        this.env.set(key, value);
        continue;
      }

      // TODO: move to executables
      if (args[0] === "cat") {
        for (const file of args.slice(1)) {
          const fd = await open(file, 0);
          await fprint(this.stdio.stdout, btostr(await readall(fd)));
        }
        continue;
      }

      let execPath: string;

      try {
        execPath = await this.locateBinary(args[0]);
      } catch (error) {
        await fprint(this.stdio.stderr, "command not found\n");
        continue;
      }

      await this.execute([execPath, ...args.slice(1)]);
    }
  }
}
