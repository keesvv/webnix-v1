import { Executable } from "../lib/exec";
import { strtob } from "../lib/strconv";

export class Init extends Executable {
  async main(): Promise<number> {
    this.stdio.stdout.write(strtob("Welcome to webnix!"));
    return 0;
  }
}
