"use strict";
(() => {
  // src/components/dx-style.ts
  var DomxStyle = class extends HTMLElement {
    constructor() {
      super();
      this.styleSheet = new CSSStyleSheet();
      this.attachStyleSheet = this.attachStyleSheet.bind(this);
      this.renderColors = this.renderColors.bind(this);
      this.renderFonts = this.renderFonts.bind(this);
    }
    connectedCallback() {
      this.attachStyleSheet();
      this.renderColors();
      this.renderFonts();
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
    }
    renderFonts() {
      const fontFamilies = this.getAttributeNames().filter((attr) => attr.startsWith("font-family-"));
      for (const fontFamily of fontFamilies) {
        const val = this.getAttribute(fontFamily);
        const fontType = fontFamily.replace("font-family-", "");
        this.styleSheet.insertRule(`.ff-${fontType} { font-family: ${val}; }`);
      }
    }
  };
  customElements.define("dx-style", DomxStyle);
})();
//# sourceMappingURL=dx-style.js.map
