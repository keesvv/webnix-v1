import { IO, Seeker } from "../../lib/io";

export interface File extends IO, Seeker {
  size(): number;
  isDir(): boolean;
}

export type FileMode = number;

export const O_CREAT: FileMode = 0o00000100;

export interface Directory extends File {}

export interface Filesystem {
  open(fname: string, mode: FileMode): Promise<File>;
  mkdir(path: string): Promise<void>;
}

export type Mountpoints = Map<string, Filesystem>;

export class FileNotFoundError extends Error {}

export class IsDirectoryError extends Error {}
