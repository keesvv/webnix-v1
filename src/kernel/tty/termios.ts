import { StdIO } from "../io";

export type TermiosAttrs = Partial<{
  echo: boolean;
}>;

export interface Termios {
  setattr(attrs: TermiosAttrs): void;
}

export type Terminal = StdIO & Termios;

export class NoTerminalError extends Error {}

export function getterm(stdio: StdIO): Terminal {
  const term = stdio as StdIO & Partial<Termios>;

  if (!term.setattr) {
    throw new NoTerminalError();
  }

  return term as Terminal;
}
