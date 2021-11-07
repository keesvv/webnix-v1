import { Filesystem, File, FileNotFoundError } from "../fs";
import { KFSDir } from "./kfs_dir";

export class KFS implements Filesystem {
  private files: Map<string, File>;

  constructor() {
    this.files = new Map();
  }

  async open(fname: string): Promise<File> {
    const file = this.files.get(fname);
    if (!file) {
      throw new FileNotFoundError();
    }

    return file;
  }

  async mkdir(path: string): Promise<void> {
    this.files.set(path, new KFSDir());
  }
}
