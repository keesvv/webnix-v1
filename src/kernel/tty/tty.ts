import { Component, Target } from "../../lib/component";
import { IO } from "../../lib/io";
import { strtob } from "../../lib/strconv";
import { Terminal, TermiosAttrs } from "../../lib/termios";
import { FramebufferIO } from "./framebuffer";
import "./tty.scss";

export class TTY implements Component, Terminal {
  private readonly tty: HTMLDivElement;
  readonly attrs: TermiosAttrs;

  readonly stdin: IO;
  readonly stdout: IO;
  readonly stderr: IO;

  constructor() {
    const tty = document.createElement("div");
    const framebuffer = document.createElement("div");
    const cursor = document.createElement("div");

    tty.classList.add("tty");
    tty.appendChild(framebuffer);
    tty.appendChild(cursor);

    framebuffer.classList.add("framebuffer");
    cursor.classList.add("cursor");

    this.tty = tty;
    this.attrs = { echo: true };

    this.stdout = new FramebufferIO(this, framebuffer);
    this.stdin = new FramebufferIO(this, framebuffer);
    this.stderr = new FramebufferIO(this, framebuffer);
  }

  setattr(attrs: TermiosAttrs): void {
    Object.assign(this.attrs, attrs);
  }

  render(target: Target): void {
    target.addEventListener("keypress", async (e) => {
      e.preventDefault();

      if (e.key === "Enter") {
        await this.stdin.write([0x0a]); // newline
        return;
      }
      await this.stdin.write(strtob(e.key));
    });

    target.appendChild(this.tty);
  }
}
