import { Component, Target } from "./lib/component";
import { IO } from "./lib/io";
import { btostr } from "./lib/strconv";
import "./tty.scss";

export class TTY implements Component, IO {
  private readonly tty: HTMLDivElement;
  private readonly framebuffer: HTMLDivElement;

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
  }

  read(): number[] {
    throw new Error("Method not implemented.");
  }

  write(data: byte[]): number {
    this.framebuffer.innerText += btostr(data);
    return data.length;
  }

  render(target: Target): void {
    target.appendChild(this.tty);
  }
}
