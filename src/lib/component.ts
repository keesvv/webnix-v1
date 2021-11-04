export type Target = HTMLElement;

export interface Component {
  render(target: Target): void;
}
