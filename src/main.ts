import { TTY } from "./tty";
import { Init } from "./bin/init";
import "./main.scss";

const tty = new TTY();
tty.render(document.body);

new Init(tty).main();
