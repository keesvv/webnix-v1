import { Executable } from "../lib/exec";
import { strtob } from "../lib/strconv";

export class KGetty extends Executable {
  async main(argv: string[]): Promise<number> {
    const hostname = "unknown"; // TODO: /etc/hostname
    const release = "0.1-alpha"; // TODO: /etc/os-release

    this.stdio.stdout.write(
      strtob(`\nwebnix ${release} ${hostname} ${argv[0]}\n${hostname} login: `)
    );
    return 0;
  }
}
