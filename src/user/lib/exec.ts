import { StdIO } from "../../kernel/io";
import { Environment } from "./process";

// TODO: separate process management from executables
// Executables should solely contain instructions.
export abstract class Executable {
  env: Environment;

  constructor(readonly stdio: StdIO, env?: Environment) {
    this.env = env || new Environment();
  }

  abstract main(argv: string[]): Promise<number>;
}
