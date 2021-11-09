import { FileInfo, FileMode, IsDirectoryError, O_CREAT } from "..";
import { Filesystem, File, FileNotFoundError } from "../fs";
import { KFSDir } from "./kfs_dir";
import { KFSFile } from "./kfs_file";

export class KFS implements Filesystem {
  private files: Map<string, File>;

  constructor() {
    this.files = new Map();
  }

  private createFile(fname: string): File {
    const file = new KFSFile();
    this.files.set(fname, file);
    return file;
  }

  async open(fname: string, mode: FileMode): Promise<File> {
    let file = this.files.get(fname);

    if ((mode & O_CREAT) === O_CREAT) {
      file = this.createFile(fname);
    }

    if (!file) {
      throw new FileNotFoundError();
    }

    if (file.isDir()) {
      throw new IsDirectoryError();
    }

    // TODO: we might need file descriptors
    file.seek(0);

    return file;
  }

  async mkdir(path: string): Promise<void> {
    this.files.set(path, new KFSDir());
  }

  async readdir(path: string): Promise<FileInfo[]> {
    return Array.from(this.files.keys())
      .filter((i) => i.startsWith(path))
      .map((i) => ({
        name: i,
        mode: 0,
      }));
  }
}
