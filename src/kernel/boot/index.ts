import { TTY } from "../tty";
import { Init } from "../../bin/init";
import { UserManager } from "../user";
import { LocalStorageIO } from "../io/localStorage";

export async function boot() {
  const tty1 = new TTY();
  tty1.render(document.body);

  const userManager = new UserManager(new LocalStorageIO("users"));
  await userManager.addUser({
    username: "kees",
    password: "seek",
    name: "Kees van Voorthuizen",
  });

  new Init(tty1).main();
}
