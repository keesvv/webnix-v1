import { btostr, strtob } from "./strconv";

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

export async function readline(r: Reader): Promise<string> {
  const ln: byte[] = [];

  while (!ln.includes(0x0a)) {
    ln.push(...(await r.read(1)));
  }

  return btostr(ln.slice(0, -1));
}

export async function readall(r: Reader): Read {
  let eof = false;
  const buf: byte[] = [];

  while (!eof) {
    try {
      buf.push(...(await r.read(512)));
    } catch (error) {
      if (!(error instanceof EOF)) {
        throw error;
      }
      eof = true;
    }
  }

  return buf;
}

export async function fprint(w: Writer, str: string): Promise<void> {
  await w.write(strtob(str));
}
