import { Filesystem, File, FileNotFoundError } from "../fs";

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
}
