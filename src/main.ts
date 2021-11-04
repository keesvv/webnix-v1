import { TTY } from "./tty";
import { strtob } from "./lib/strconv";
import "./main.scss";

const tty = new TTY();
tty.render(document.body);
tty.write(strtob("Hello, world!"));
