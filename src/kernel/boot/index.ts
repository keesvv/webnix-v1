import { TTY } from "../tty";
import { Init } from "../../bin/init";
import { UserManager } from "../user";
import { LocalStorageIO } from "../io/localStorage";
import { panic } from "../panic";
import { mount } from "../fs";
import { KFS } from "../fs/kfs/kfs";

export async function boot() {
  mount("/", new KFS());

  const tty1 = new TTY();
  tty1.render(document.body);

  const userManager = new UserManager(new LocalStorageIO("users"));
  await userManager.addUser({
    username: "kees",
    password: "seek",
    name: "Kees van Voorthuizen",
  });

  try {
    await new Init(tty1).main();
  } catch (error) {
    panic();
  }
}
