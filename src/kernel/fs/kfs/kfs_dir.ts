import { Read, Write } from "../../io";
import { Directory } from "../fs";

export class KFSDir implements Directory {
  size(): number {
    throw new Error("not implemented");
  }

  read(): Read {
    throw new Error("not implemented");
  }

  write(): Write {
    throw new Error("not implemented");
  }

  seek(): void {
    throw new Error("not implemented");
  }

  isDir(): boolean {
    return true;
  }
}
