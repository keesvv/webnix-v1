import { IO, Read, Write } from "@lib/io";

export class NullIO implements IO {
  async read(): Read {
    return [];
  }

  async write(): Write {
    return 0;
  }
}
