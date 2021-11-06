import { LocalStorageIO } from "../kernel/io/localStorage";
import { UserManager } from "../kernel/user";
import { Executable } from "../lib/exec";
import { fprint, readline, StdIO } from "../lib/io";
import { sleep } from "../lib/thread";

export class KGetty extends Executable {
  private readonly hostname = "unknown";
  private userManager: UserManager;

  constructor(readonly stdio: StdIO) {
    super(stdio);
    this.userManager = new UserManager(new LocalStorageIO("users"));
  }

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

  private async fail(): Promise<void> {
    await sleep(1500);
    await fprint(this.stdio.stdout, "Authentication failure.\n");
  }

  async main(argv: string[]): Promise<number> {
    const hostname = "unknown"; // TODO: /etc/hostname
    const release = "0.1-alpha"; // TODO: /etc/os-release

    await fprint(
      this.stdio.stdout,
      `\nwebnix ${release} ${hostname} ${argv[0]}\n`
    );

    let authenticated = false;
    while (!authenticated) {
      const [username, password] = await this.prompt();
      const user = await this.userManager.findUser(username);

      if (!user || password != user.password) {
        await this.fail();
        continue;
      }

      authenticated = true;
    }

    fprint(this.stdio.stdout, "Authenticated.\n");
    return 0;
  }
}
