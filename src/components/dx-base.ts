export type DxStyle = [bp: string, prop: string, val: string, psuedo?: string, subSelector?: string];

export class DomxBase extends HTMLElement {
  baseStyles: DxStyle[] = [];
  props: string[] = [];
  rendered: boolean = false;
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = "<slot></slot>";
    this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
    this.render = this.render.bind(this);
    this.renderCss = this.renderCss.bind(this);
    this.getStylesFromEl = this.getStylesFromEl.bind(this);
  }
  connectedCallback() {
    this.render();
    this.dispatchEvent(new CustomEvent("rendered"));
    this.rendered = true;
  }
  renderCss(styles: DxStyle[]) {
    const renderedStyles = styles
      .sort((a) => (a[3] ? 1 : -1)) // sort by psuedo
      .sort((a, b) => Number(a[0]) - Number(b[0])) // sort by breakpoint
      .map(([bp = "0", prop, val, psuedo, sub = ""]) => {
        const subSelector = `${sub !== "" ? `::slotted(${sub})` : ""}`;
        return `@media (min-width: ${bp}px) { :host${
          psuedo ? `(:${psuedo}) ${subSelector}` : subSelector
        } { ${prop}:${val}; }}`;
      })
      .join("\n");
    return renderedStyles;
  }
  getStylesFromEl(el: HTMLElement, subSelector?: string): DxStyle[] {
    return el
      .getAttributeNames()
      .filter((attr) => !this.props.includes(attr) && !attr.includes("onclick:"))
      .map((attributeName) => {
        const [attr, psuedo] = attributeName.split(":");
        const [prop, bp] = attr.split("--");
        const value = el.getAttribute(attributeName) ?? "";
        return [bp, prop, value, psuedo, subSelector];
      });
  }
  async render() {}
}
