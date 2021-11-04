import { Component, Target } from "./lib/component";
import { IO, NullIO, StdIO } from "./lib/io";
import { btostr } from "./lib/strconv";
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

    this.stdin = new NullIO();
    this.stderr = new NullIO();
    this.stdout = {
      write: this.writeToBuffer.bind(this),
      read() {
        throw new Error("not implemented");
      },
    };
  }

  private writeToBuffer(data: byte[]): number {
    this.framebuffer.innerText += btostr(data);
    return data.length;
  }

  render(target: Target): void {
    target.appendChild(this.tty);
  }
}
