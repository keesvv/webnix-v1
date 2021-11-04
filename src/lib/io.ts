export interface IO {
  read(n: number): byte[];
  write(data: byte[]): number;
}

export interface StdIO {
  stdin: IO;
  stdout: IO;
  stderr: IO;
}

export class NullIO implements IO {
  read(): number[] {
    return [];
  }

  write(): number {
    return 0;
  }
}
