import { TTY } from "../tty";
import { Init } from "../../bin/init";
import { UserManager } from "../user";
import { LocalStorageIO } from "../io/localStorage";
import { panic } from "../panic";
import { mount, O_CREAT } from "../fs";
import { KFS } from "../fs/kfs";
import { mkdir, open } from "../../lib/fs";
import { strtob } from "../../lib/strconv";

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
