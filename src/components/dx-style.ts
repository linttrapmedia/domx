export class DomxStyle extends HTMLElement {
  baseStyles: string[][] = [["display", "inherit"]];
  slottedStyles: string[][] = [];
  psuedoStyles: Record<string, [string, string][]> = {};
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
    window.addEventListener("resize", this.render);
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.render);
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
      .sort((a, b) => (a[3] ? 1 : -1)) // sort by psuedo
      .sort((a, b) => Number(a[0]) - Number(b[0])) // sort by breakpoint
      .map(
        ([bp, prop, val, psuedo]) =>
          `@media (min-width: ${bp}px) { ::slotted${
            psuedo ? `(*:${psuedo})` : "(*)"
          } { ${prop}:${val} !important; }}`
      )
      .join("\n");
    return `:host { display:inherit; } ` + renderedStyles;
  }
  render() {
    this.styleSheet.replace(this.renderCss());
  }
}

customElements.define("dx-style", DomxStyle);
