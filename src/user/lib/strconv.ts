export function strtob(str: string): byte[] {
  return [...str].map((i) => i.charCodeAt(0));
}

export function btostr(b: byte[]): string {
  return String.fromCharCode(...b);
}
