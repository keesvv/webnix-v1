import { TTY } from ".";
import { Write } from "@lib/io";
import { btostr } from "@lib/strconv";
import { StreamIO } from "../io";

export class FramebufferIO extends StreamIO {
  constructor(
    private readonly tty: TTY,
    private readonly framebuffer: HTMLElement
  ) {
    super();
  }

  write(data: byte[]): Write {
    if (this.tty.attrs.echo) {
      this.framebuffer.innerText += btostr(data);
    }
    return super.write(data);
  }
}
