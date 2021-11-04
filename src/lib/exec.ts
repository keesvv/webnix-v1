import { StdIO } from "./io";

export abstract class Executable {
  constructor(readonly stdio: StdIO) {}

  abstract main(): Promise<number>;
}
