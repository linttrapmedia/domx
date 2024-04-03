export class DomxStyle extends HTMLElement {
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  constructor() {
    super();
    this.attachStyleSheet = this.attachStyleSheet.bind(this);
    this.renderColors = this.renderColors.bind(this);
  }
  connectedCallback() {
    this.attachStyleSheet();
    this.renderColors();
  }
  attachStyleSheet() {
    document.adoptedStyleSheets = [this.styleSheet, ...document.adoptedStyleSheets];
  }
  renderColors() {
    const colors = this.getAttributeNames().filter((attr) => attr.startsWith("color-"));
    for (const color of colors) {
      const arg = this.getAttribute(color) || "";
      this.styleSheet.insertRule(`.${color} { color: ${arg}; }`);
      this.styleSheet.insertRule(`.hover\\:${color}:hover { color: ${arg}; }`);
      this.styleSheet.insertRule(`.bg-${color} { background-color: ${arg}; }`);
      this.styleSheet.insertRule(`.hover\\:bg-${color}:hover { background-color: ${arg}; }`);
    }
    console.log(this.styleSheet.cssRules);
  }
}

customElements.define("dx-style", DomxStyle);
