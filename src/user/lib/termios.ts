import { Terminal } from "../../kernel/tty/termios";
import { readline } from "./ioutil";

export async function getpass(term: Terminal): Promise<string> {
  // Disable echo for security
  term.setattr({ echo: false });

  const pass = await readline(term.stdin);

  // Re-enable echo & print newline
  term.setattr({ echo: true });
  term.stdin.write([0x0a]);
  return pass;
}
