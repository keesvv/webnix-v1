import EventEmitter from "eventemitter3";
import { IO, Read, Write } from "../../lib/io";
import { btostr } from "../../lib/strconv";

export type Framebuffer = HTMLDivElement;

export class FramebufferIO implements IO {
  private emitter: EventEmitter;

  constructor(private readonly framebuffer: Framebuffer) {
    this.emitter = new EventEmitter();
  }

  read(n: number): Read {
    return new Promise((resolve) => {
      const recv: byte[] = [];

      this.emitter.on("data", (data: byte[]) => {
        if (recv.length + data.length > n) {
          this.emitter.off("data");
          recv.push(...data.slice(0, n - recv.length));
          return resolve(recv);
        }

        recv.push(...data);
      });
    });
  }

  async write(data: byte[]): Write {
    this.framebuffer.innerText += btostr(data);
    this.emitter.emit("data", data);
    return data.length;
  }
}
