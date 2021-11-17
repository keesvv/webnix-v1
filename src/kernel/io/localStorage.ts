import { EOF, IO, Read, Seeker, Write } from ".";
import { btostr, strtob } from "@lib/strconv";

export class LocalStorageIO implements IO, Seeker {
  private offset: number;

  constructor(readonly key: string) {
    this.offset = 0;
  }

  seek(offset: number): void {
    this.offset = offset;
  }

  async read(n: number): Read {
    const b = strtob(localStorage.getItem(this.key) || "").slice(
      this.offset,
      n
    );

    if (!b.length) {
      throw new EOF();
    }

    this.offset += b.length;
    return b;
  }

  async write(data: byte[]): Write {
    localStorage.setItem(this.key, btostr(data));
    return data.length;
  }
}
