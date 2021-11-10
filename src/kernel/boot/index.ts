import { TTY } from "../tty";
import { Init } from "../../bin/init";
import { UserManager } from "../user";
import { LocalStorageIO } from "../io/localStorage";
import { panic } from "../panic";
import { mount, O_CREAT } from "../fs";
import { KFS } from "../fs/kfs";
import { mkdir, open } from "../../lib/fs";
import { strtob } from "../../lib/strconv";
import { ExecCtor, writeExecutable } from "../exec";
import { Keesh } from "../../bin/keesh";
import { KGetty } from "../../bin/kgetty";

export async function registerBinaries(m: Map<string, ExecCtor>) {
  for (const exec of m.entries()) {
    const f = await open(exec[0], O_CREAT);
    writeExecutable(f, exec[1]);
  }
}

export async function setupFs() {
  mount("/", new KFS());
  await mkdir("/bin");

  const hello = await open("/hello.txt", O_CREAT);
  hello.write(strtob("Hello, world!\n"));
}

export async function boot() {
  try {
    const tty1 = new TTY();
    tty1.render(document.body);

    await setupFs();
    await registerBinaries(
      new Map<string, ExecCtor>([
        ["/bin/init", Init],
        ["/bin/keesh", Keesh],
        ["/bin/kgetty", KGetty],
      ])
    );

    const userManager = new UserManager(new LocalStorageIO("users"));
    await userManager.addUser({
      username: "kees",
      password: "seek",
      name: "Kees van Voorthuizen",
    });

    await new Init(tty1).main();
  } catch (error) {
    panic();
  }
}
