import { exec } from "../kernel/exec";
import { LocalStorageIO } from "../kernel/io/localStorage";
import { UserManager } from "../kernel/user";
import { Executable } from "../lib/exec";
import { fprint, readline, StdIO } from "../lib/io";
import { Environment } from "../lib/process";
import { getpass, getterm, Terminal } from "../lib/termios";
import { sleep } from "../lib/thread";

export class KGetty extends Executable {
  private readonly hostname = "unknown";
  private userManager: UserManager;
  private term!: Terminal;

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
    const password = await getpass(this.term);

    return [username, password];
  }

  private async fail(): Promise<void> {
    await sleep(1500);
    await fprint(this.stdio.stdout, "Authentication failure.\n");
  }

  private async auth(): Promise<void> {
    while (true) {
      const [username, password] = await this.prompt();
      const user = await this.userManager.findUser(username);

      if (!user || password != user.password) {
        await this.fail();
        continue;
      }

      return;
    }
  }

  async main(argv: string[]): Promise<number> {
    const hostname = "unknown"; // TODO: /etc/hostname
    const release = "0.1-alpha"; // TODO: /etc/os-release

    try {
      this.term = getterm(this.stdio);
    } catch (error) {
      await fprint(this.stdio.stderr, "error: not a terminal");
      return 1;
    }

    await fprint(
      this.stdio.stdout,
      `\nwebnix ${release} ${hostname} ${argv[0]}\n`
    );

    while (true) {
      await this.auth();
      await exec(
        "/bin/keesh",
        [],
        this.stdio,
        new Environment([["PS1", "$ "]])
      );
    }
  }
}
