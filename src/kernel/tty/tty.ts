import { Component, Target } from "../../lib/component";
import { IO, StdIO } from "../../lib/io";
import { strtob } from "../../lib/strconv";
import { FramebufferIO } from "./framebuffer";
import "./tty.scss";

export class TTY implements Component, StdIO {
  private readonly tty: HTMLDivElement;

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

    this.stdout = new FramebufferIO(framebuffer);
    this.stdin = new FramebufferIO(framebuffer);
    this.stderr = new FramebufferIO(framebuffer);
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
