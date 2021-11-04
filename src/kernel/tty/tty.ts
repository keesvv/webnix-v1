import { Component, Target } from "../../lib/component";
import { IO, StdIO } from "../../lib/io";
import { btostr, strtob } from "../../lib/strconv";
import "./tty.scss";

export class TTY implements Component, StdIO {
  private readonly tty: HTMLDivElement;
  private readonly framebuffer: HTMLDivElement;

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

    this.stdout = {
      write: this.writeToBuffer.bind(this),
      read() {
        throw new Error("not implemented");
      },
    };
    this.stdin = this.stdout;
    this.stderr = this.stdout;
  }

  private writeToBuffer(data: byte[]): number {
    this.framebuffer.innerText += btostr(data);
    return data.length;
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
