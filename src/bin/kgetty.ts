import { Executable } from "../lib/exec";
import { fprint, readline } from "../lib/io";

export class KGetty extends Executable {
  async main(argv: string[]): Promise<number> {
    const hostname = "unknown"; // TODO: /etc/hostname
    const release = "0.1-alpha"; // TODO: /etc/os-release

    await fprint(
      this.stdio.stdout,
      `\nwebnix ${release} ${hostname} ${argv[0]}\n${hostname} login: `
    );

    const username = await readline(this.stdio.stdin);
    await fprint(this.stdio.stdout, `password for ${username}: `);

    const password = await readline(this.stdio.stdin);
    await fprint(this.stdio.stdout, "Authentication failure.\n");
    return 0;
  }
}
