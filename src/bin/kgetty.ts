import { Executable } from "../lib/exec";
import { fprint, readline } from "../lib/io";
import { sleep } from "../lib/thread";

export class KGetty extends Executable {
  private readonly hostname = "unknown";

  private async prompt(): Promise<[string, string]> {
    let username = "";
    while (!username.length) {
      await fprint(this.stdio.stdout, `${this.hostname} login: `);
      username = await readline(this.stdio.stdin);
    }

    await fprint(this.stdio.stdout, `password for ${username}: `);
    const password = await readline(this.stdio.stdin);

    return [username, password];
  }

  async main(argv: string[]): Promise<number> {
    const hostname = "unknown"; // TODO: /etc/hostname
    const release = "0.1-alpha"; // TODO: /etc/os-release

    await fprint(
      this.stdio.stdout,
      `\nwebnix ${release} ${hostname} ${argv[0]}\n`
    );

    await this.prompt();
    await sleep(1500);
    await fprint(this.stdio.stdout, "Authentication failure.\n");
    return 0;
  }
}
