import { File, FileNotFoundError, Filesystem } from "./fs";

const mountpoints: Map<string, Filesystem> = new Map();

export function mount(mountpoint: string, fs: Filesystem): void {
  mountpoints.set(mountpoint, fs);
}

export function getMounts(): Map<string, Filesystem> {
  return mountpoints;
}

function locateFs(fname: string): Filesystem | null {
  for (const [mountpoint, fs] of mountpoints) {
    if (fname.startsWith(mountpoint)) {
      return fs;
    }
  }

  return null;
}

// TODO: write some sort of `Filesystem` proxy
// or whatever
// idk
// this just doesn't cut it
export async function open(fname: string): Promise<File> {
  const fs = locateFs(fname);
  if (!fs) {
    throw new FileNotFoundError();
  }

  return fs.open(fname);
}
