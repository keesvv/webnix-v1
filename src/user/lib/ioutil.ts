import { O_CREAT } from "../../kernel/fs";
import { EOF, Read, Reader, Writer } from "../../kernel/io";
import { open } from "./fs";
import { btostr, strtob } from "./strconv";

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

export async function writeall(fname: string, b: byte[]) {
  const f = await open(fname, O_CREAT);
  await f.write(b);
}

export async function fprint(w: Writer, str: string): Promise<void> {
  await w.write(strtob(str));
}
