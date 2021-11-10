import { exec } from "../kernel/exec";
import { Executable } from "../lib/exec";
import { open } from "../lib/fs";
import { fprint, readall, readline } from "../lib/io";
import { btostr } from "../lib/strconv";

export class Keesh extends Executable {
  async main(): Promise<number> {
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

      try {
        await exec(args[0], args.slice(1), this.stdio, this.env);
      } catch (error) {
        fprint(this.stdio.stderr, "invalid executable\n");
        continue;
      }
    }
  }
}
