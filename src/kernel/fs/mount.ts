import { Filesystem, Mountpoints } from "./fs";

const mountpoints: Mountpoints = new Map();

export function mount(mountpoint: string, fs: Filesystem): void {
  mountpoints.set(mountpoint, fs);
}

export function getMounts(): Readonly<Mountpoints> {
  return Object.freeze(mountpoints);
}
