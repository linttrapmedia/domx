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
  render() {
    let slottedStylesList = this.slottedStyles;
    let psuedoStylesList: Record<string, [string, string][]> = {};
    this.getAttributeNames().forEach((attributeName) => {
      const [attr, psuedo] = attributeName.split(":");
      const [style, bp] = attr.split("--");
      const breakpoint = Number(bp ?? 0);
      if (window.innerWidth < breakpoint) return;
      const value = (this as any).getAttribute(attributeName);
      if (psuedo) {
        if (!psuedoStylesList[psuedo]) psuedoStylesList[psuedo] = [];
        psuedoStylesList[psuedo].push([style, value]);
      } else {
        slottedStylesList.push([style, value]);
      }
    });

    // generate host styles
    const hostStyles = `:host{ ${this.baseStyles
      .map(([attr, value]) => `${attr}:${value};`)
      .join("")}}`;

    // generate host slotted styles
    const hostSlottedStyles = `::slotted(*){ ${slottedStylesList
      .map(([attr, value]) => `${attr}:${value} !important;`)
      .join("")}}`;

    // generate host slotted psuedo styles
    const hostSlottedPsuedoStyles = Object.entries(psuedoStylesList)
      .map(([psuedo, styles]) => {
        const _styles = styles
          .map(([attr, value]) => `${attr}:${value} !important;`)
          .join("");
        return `::slotted(*:${psuedo}) { ${_styles} }`;
      })
      .join("");

    this.styleSheet.replace(
      hostStyles + hostSlottedStyles + hostSlottedPsuedoStyles
    );
  }
}

customElements.define("dx-style", DomxStyle);
