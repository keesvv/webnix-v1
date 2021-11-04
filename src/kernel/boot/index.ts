import { TTY } from "../tty";
import { Init } from "../../bin/init";

export async function boot() {
  const tty1 = new TTY();
  tty1.render(document.body);

  new Init(tty1).main();
}
