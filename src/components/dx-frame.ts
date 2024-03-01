export class DomxFrame extends HTMLElement {
  behaviorAttributeNames: string[] = ["src", "allowfullscreen", "allow"];
  baseStyles: string = `:host { box-sizing: border-box; display: flex; }`;
  psuedoStyles: Record<string, [string, string][]> = {};
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = "<slot></slot>";
    this.render = this.render.bind(this);
    this.renderCss = this.renderCss.bind(this);
    this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
  }
  connectedCallback() {
    this.render();
  }
  renderCss(attributes: string[] = []) {
    let styles: [bp: string, prop: string, val: string, psuedo: string][] = [];
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
          `@media (min-width: ${bp}px) { :host ${
            psuedo ? `iframe:${psuedo}` : "iframe"
          } { ${prop}:${val}; }}`
      )
      .join("\n");
    console.log(renderedStyles);
    return this.baseStyles + renderedStyles;
  }
  render() {
    this.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = this.getAttribute("src") as string;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";
    iframe.allowFullscreen = this.hasAttribute("allowfullscreen");
    iframe.allow = this.getAttribute("allow") || "";
    this.shadowRoot!.appendChild(iframe);
    const styleAttributes = this.getAttributeNames().filter(
      (attr) => !this.behaviorAttributeNames.includes(attr)
    );
    this.styleSheet.replace(this.renderCss(styleAttributes));
    console.log(this.renderCss(styleAttributes));
  }
}

customElements.define("dx-frame", DomxFrame);
