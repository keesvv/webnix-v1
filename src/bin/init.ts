import { Executable } from "../lib/exec";
import { fprint } from "../lib/io";
import { sleep } from "../lib/thread";
import { KGetty } from "./kgetty";

export class Init extends Executable {
  async main(): Promise<number> {
    await fprint(
      this.stdio.stdout,
      "Welcome to webnix!\n\n" +
        "This project is still in a VERY early development stage.\n" +
        "Don't expect everything to work just yet.\n" +
        "~keesvv\n\n" +
        "Default credentials:\n" +
        `Username: kees\nPassword: seek\n`
    );

    await sleep(120);
    await new KGetty(this.stdio).main(["tty1"]);
    return 0;
  }
}
