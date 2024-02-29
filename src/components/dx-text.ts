export class DomxText extends HTMLElement {
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = "<slot></slot>";
    this.render = this.render.bind(this);
    this.renderCss = this.renderCss.bind(this);
    this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") this.render();
      });
    });
    observer.observe(this, { attributes: true });
  }
  connectedCallback() {
    this.render();
  }
  renderCss() {
    let styles: [bp: string, prop: string, val: string, psuedo: string][] = [];
    const attributes = this.getAttributeNames();
    for (let i = 0; i < attributes.length; i++) {
      const attributeName = attributes[i];
      const [attr, psuedo] = attributeName.split(":");
      const [prop, bp = "0"] = attr.split("--");
      const value = (this as any).getAttribute(attributeName);
      styles.push([bp, prop, value, psuedo]);
    }
    const renderedStyles = styles
      .sort((a) => (a[3] ? 1 : -1)) // sort by psuedo
      .sort((a, b) => Number(a[0]) - Number(b[0])) // sort by breakpoint
      .map(
        ([bp, prop, val, psuedo]) =>
          `@media (min-width: ${bp}px) { :host${
            psuedo ? `:${psuedo}` : ""
          } { ${prop}:${val}; }}`
      )
      .join("\n");
    return renderedStyles;
  }
  render() {
    this.styleSheet.replace(this.renderCss());
    this.dispatchEvent(new CustomEvent("rendered"));
  }
}

customElements.define("dx-text", DomxText);
