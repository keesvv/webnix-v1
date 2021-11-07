import { IO, Seeker } from "../../lib/io";

export interface File extends IO, Seeker {
  size(): number;
  isDir(): boolean;
}

export interface Directory extends File {}

export interface Filesystem {
  open(fname: string): Promise<File>;
  mkdir(path: string): Promise<void>;
}

export class FileNotFoundError extends Error {}
