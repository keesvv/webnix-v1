import { Executable } from "@lib/exec";
import { btostr, strtob } from "@lib/strconv";
import { File } from "../fs";
import { v4 as uuidv4 } from "uuid";
import { open } from "@lib/fs";
import { readall } from "@lib/ioutil";
import { Environment } from "@lib/process";
import { StdIO } from "../io";

export type ExecCtor = { new (stdio: StdIO, env?: Environment): Executable };

const executables: Map<string, ExecCtor> = new Map();

export class InvalidExecError extends Error {}

export function writeExecutable(file: File, exec: ExecCtor) {
  const execId = uuidv4();
  executables.set(execId, exec);
  file.write(strtob(`#!${execId}\n`));
}

export async function exec(
  fname: string,
  argv: string[],
  stdio: StdIO,
  env?: Environment
): Promise<number> {
  const f = await open(fname, 0);
  const contents = btostr(await readall(f));
  const execId = contents.slice(2, -1);

  const execCtor = executables.get(execId);
  if (!execCtor) {
    throw new InvalidExecError();
  }

  const executable = new execCtor(stdio, env);
  return executable.main(argv);
}
