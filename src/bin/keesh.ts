import { Executable } from "../lib/exec";
import { fprint, readline } from "../lib/io";

export class Keesh extends Executable {
  async main(): Promise<number> {
    while (true) {
      fprint(this.stdio.stdout, "$ ");
      const ln = await readline(this.stdio.stdin);

      if (!ln.length || ln.startsWith("#")) {
        continue;
      }

      // TODO: refactor
      if (ln === "exit") {
        return 0;
      }

      fprint(this.stdio.stderr, "not implemented\n");
    }
  }
}
