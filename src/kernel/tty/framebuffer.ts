import { IO } from "../../lib/io";
import { btostr } from "../../lib/strconv";

export type Framebuffer = HTMLDivElement;

export class FramebufferIO implements IO {
  constructor(private readonly framebuffer: Framebuffer) {}

  read(): byte[] {
    throw new Error("not implemented");
  }

  write(data: byte[]): number {
    this.framebuffer.innerText += btostr(data);
    return data.length;
  }
}
