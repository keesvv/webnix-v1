import { Framebuffer, FramebufferIO } from ".";
import { Component, Target } from "../../lib/component";
import { IO, StdIO } from "../../lib/io";
import { strtob } from "../../lib/strconv";
import "./tty.scss";

export class TTY implements Component, StdIO {
  private readonly tty: HTMLDivElement;
  private readonly framebuffer: Framebuffer;

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
    this.framebuffer = framebuffer;

    this.stdout = new FramebufferIO(this.framebuffer);
    this.stdin = this.stdout;
    this.stderr = this.stdout;
  }

  render(target: Target): void {
    target.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.stdin.write([0x0a]); // newline
        return;
      }
      this.stdin.write(strtob(e.key));
    });

    target.appendChild(this.tty);
  }
}
