import { FileNotFoundError, Filesystem, File, getMounts } from "../kernel/fs";

function locateFs(fname: string): Filesystem {
  for (const [mountpoint, fs] of getMounts()) {
    if (fname.startsWith(mountpoint)) {
      return fs;
    }
  }

  throw new FileNotFoundError();
}

export async function open(fname: string): Promise<File> {
  return locateFs(fname).open(fname);
}

export async function mkdir(path: string): Promise<void> {
  return locateFs(path).mkdir(path);
}
