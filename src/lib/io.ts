export type Read = Promise<byte[]>;
export type Write = Promise<number>;

export interface IO {
  read(n: number): Read;
  write(data: byte[]): Write;
}

export interface StdIO {
  stdin: IO;
  stdout: IO;
  stderr: IO;
}

export class NullIO implements IO {
  async read(): Read {
    return [];
  }

  async write(): Write {
    return 0;
  }
}
