import "./main.scss";
import { TTY } from "../kernel/tty";
import { Init } from "./bin/init";
import { UserManager } from "@lib/user/manager";
import { panic } from "../kernel/panic";
import { mount, O_CREAT } from "../kernel/fs";
import { KFS } from "../kernel/fs/kfs";
import { open, makeroot } from "./lib/fs";
import { strtob } from "./lib/strconv";
import { exec, ExecCtor, writeExecutable } from "../kernel/exec";
import { Keesh } from "./bin/keesh";
import { KGetty } from "./bin/kgetty";
import { writeall } from "@lib/ioutil";

export async function registerBinaries(m: Map<string, ExecCtor>) {
  for (const [fname, ctor] of m.entries()) {
    const f = await open(fname, O_CREAT);
    writeExecutable(f, ctor);
  }
}

export async function setupFs() {
  // Mount root
  mount("/", new KFS());

  // Set up the root filesystem
  await makeroot();

  // Put all binaries in /bin
  await registerBinaries(
    new Map<string, ExecCtor>([
      ["/bin/init", Init],
      ["/bin/keesh", Keesh],
      ["/bin/kgetty", KGetty],
    ])
  );

  await writeall("/hello.txt", strtob("Hello, world!\n"));
}

export async function boot() {
  try {
    const tty1 = new TTY();
    tty1.render(document.body);

    await setupFs();

    const userManager = new UserManager(await open("/etc/passwd", O_CREAT));
    await userManager.addUser({
      username: "kees",
      password: "seek",
      name: "Kees van Voorthuizen",
      shell: "/bin/keesh",
    });

    await exec("/bin/init", [], tty1);
  } catch (error) {
    panic();
  }
}

boot();
