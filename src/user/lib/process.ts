export class Environment extends Map<string, string> {
  expand(str: string): string {
    let res = str;

    for (const [key, value] of this.entries()) {
      res = res.replaceAll("$" + key, value);
    }

    return res;
  }
}
