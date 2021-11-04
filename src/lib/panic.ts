export function panic(): void {
  // Hacky workaround to directly access the framebuffer
  // TODO: actually write to TTY1's stdout
  const framebuffer = document.getElementsByClassName(
    "framebuffer"
  )[0] as HTMLDivElement;

  framebuffer.innerText += "\n-- [ KERNEL PANIC ] --\nStop.";
  document.title = "KERNEL PANIC";
}
