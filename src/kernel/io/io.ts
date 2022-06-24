export type Read = Promise<byte[]>;
export type Write = Promise<number>;

export interface Reader {
  read(n: number): Read;
}

export interface Writer {
  write(data: byte[]): Write;
}

export interface Seeker {
  seek(offset: number): void;
}

export type IO = Reader & Writer;

export interface StdIO {
  stdin: IO;
  stdout: IO;
  stderr: IO;
}

export class EOF extends Error {}
