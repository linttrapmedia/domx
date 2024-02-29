export class DomxAnchor extends HTMLElement {
  anchor: HTMLAnchorElement = document.createElement("a");
  behaviorAttributeNames: string[] = ["href", "target"];
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
  renderCss(attributes: string[]) {
    let styles: [bp: string, prop: string, val: string, psuedo: string][] = [
      ["0", "cursor", "pointer", ""],
      ["0", "display", "inline-block", ""],
      ["0", "box-sizing", "border-box", ""],
    ];
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
          `@media (min-width: ${bp}px) { :host ${
            psuedo ? `a:${psuedo}` : "a"
          } { ${prop}:${val}; }}`
      )
      .join("\n");
    return renderedStyles;
  }
  render() {
    this.anchor.setAttribute("href", this.getAttribute("href") ?? "#"); // Get the href attribute from the custom element
    this.anchor.innerText = this.innerText; // Set the text inside the custom element
    this.anchor.setAttribute("target", this.getAttribute("target") ?? "_self"); // Get the target attribute from the custom element
    this.innerHTML = ""; // Clear the custom element
    this.shadowRoot!.appendChild(this.anchor);
    const styleAttributes = this.getAttributeNames().filter(
      (attr) => !this.behaviorAttributeNames.includes(attr)
    );
    this.styleSheet.replace(this.renderCss(styleAttributes));
    this.dispatchEvent(new CustomEvent("rendered"));
  }
}

customElements.define("dx-anchor", DomxAnchor);
