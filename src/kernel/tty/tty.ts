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
    this.stdin = new FramebufferIO(this.framebuffer);
    this.stderr = new FramebufferIO(this.framebuffer);
  }

  render(target: Target): void {
    target.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        await this.stdin.write([0x0a]); // newline
        return;
      }
      await this.stdin.write(strtob(e.key));
    });

    target.appendChild(this.tty);
  }
}
