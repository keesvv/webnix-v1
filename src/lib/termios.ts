import { readline, StdIO } from "./io";

export type TermiosAttrs = Partial<{
  echo: boolean;
}>;

export interface Termios {
  setattr(attrs: TermiosAttrs): void;
}

export async function getpass(term: StdIO & Termios): Promise<string> {
  // Disable echo for security
  term.setattr({ echo: false });

  const pass = await readline(term.stdin);

  // Re-enable echo
  term.setattr({ echo: true });
  return pass;
}
