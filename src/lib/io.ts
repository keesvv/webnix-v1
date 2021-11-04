export interface IO {
  read(n: number): byte[];
  write(data: byte[]): number;
}
