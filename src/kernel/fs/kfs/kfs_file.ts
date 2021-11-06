import { EOF, Read, Write } from "../../../lib/io";
import { File } from "../fs";

export class KFSFile implements File {
  private contents: byte[];
  private offset: number;

  constructor() {
    this.contents = [];
    this.offset = 0;
  }

  size(): number {
    return this.contents.length;
  }

  async read(n: number): Read {
    const b = this.contents.slice(this.offset, n);
    if (!b.length) {
      throw new EOF();
    }

    this.offset += b.length;
    return b;
  }

  async write(data: byte[]): Write {
    this.contents = data;
    return data.length;
  }

  seek(offset: number): void {
    this.offset = offset;
  }
}
