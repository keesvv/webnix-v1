import "./main.scss";
import { TTY } from "../kernel/tty";
import { Init } from "./bin/init";
import { UserManager } from "@lib/user/manager";
import { LocalStorageIO } from "../kernel/io/localStorage";
import { panic } from "../kernel/panic";
import { mount, O_CREAT } from "../kernel/fs";
import { KFS } from "../kernel/fs/kfs";
import { mkdir, open } from "./lib/fs";
import { strtob } from "./lib/strconv";
import { exec, ExecCtor, writeExecutable } from "../kernel/exec";
import { Keesh } from "./bin/keesh";
import { KGetty } from "./bin/kgetty";

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

    await exec("/bin/init", [], tty1);
  } catch (error) {
    panic();
  }
}

boot();
