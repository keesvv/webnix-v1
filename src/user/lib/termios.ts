import { readline, StdIO } from "./io";

export type TermiosAttrs = Partial<{
  echo: boolean;
}>;

export interface Termios {
  setattr(attrs: TermiosAttrs): void;
}

export type Terminal = StdIO & Termios;

export class NoTerminalError extends Error {}

export async function getpass(term: Terminal): Promise<string> {
  // Disable echo for security
  term.setattr({ echo: false });

  const pass = await readline(term.stdin);

  // Re-enable echo & print newline
  term.setattr({ echo: true });
  term.stdin.write([0x0a]);
  return pass;
}

export function getterm(stdio: StdIO): Terminal {
  const term = stdio as StdIO & Partial<Termios>;

  if (!term.setattr) {
    throw new NoTerminalError();
  }

  return term as Terminal;
}
