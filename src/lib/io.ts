export type Read = Promise<byte[]>;
export type Write = Promise<number>;

export interface Reader {
  read(n: number): Read;
}

export interface Writer {
  write(data: byte[]): Write;
}

export type IO = Reader & Writer;

export interface StdIO {
  stdin: IO;
  stdout: IO;
  stderr: IO;
}
