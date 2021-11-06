import { btostr, strtob } from "./strconv";

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

export async function readline(r: Reader): Promise<string> {
  const ln: byte[] = [];

  while (!ln.includes(0x0a)) {
    ln.push(...(await r.read(1)));
  }

  return btostr(ln.slice(0, -1));
}

export async function fprint(w: Writer, str: string): Promise<void> {
  await w.write(strtob(str));
}
