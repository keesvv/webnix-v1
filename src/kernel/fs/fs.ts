import { IO, Seeker } from "../../lib/io";

export interface File extends IO, Seeker {
  size(): number;
}

export interface Filesystem {
  open(fname: string): Promise<File>;
}

export class FileNotFoundError extends Error {}
