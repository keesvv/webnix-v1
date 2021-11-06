import { Executable } from "../lib/exec";
import { fprint, readline } from "../lib/io";

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

      fprint(this.stdio.stderr, "not implemented\n");
    }
  }
}
