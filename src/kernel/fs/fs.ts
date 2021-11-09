import { IO, Seeker } from "../../lib/io";

// TODO: we need a proper FileInfo interface
export type FileInfo = string;

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
  readdir(path: string): Promise<FileInfo[]>;
  // TODO: stat()
}

export type Mountpoints = Map<string, Filesystem>;

export class FileNotFoundError extends Error {}

export class IsDirectoryError extends Error {}
