import { Write } from "../../lib/io";
import { btostr } from "../../lib/strconv";
import { StreamIO } from "../io";

export class FramebufferIO extends StreamIO {
  constructor(private readonly framebuffer: HTMLDivElement) {
    super();
  }

  write(data: byte[]): Write {
    this.framebuffer.innerText += btostr(data);
    return super.write(data);
  }
}
