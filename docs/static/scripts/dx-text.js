"use strict";
(() => {
  // src/components/dx-text.ts
  var DomxText = class extends HTMLElement {
    constructor() {
      super();
      this.styleSheet = new CSSStyleSheet();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = "<slot></slot>";
      this.render = this.render.bind(this);
      this.renderCss = this.renderCss.bind(this);
      this.shadowRoot.adoptedStyleSheets = [this.styleSheet];
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "attributes")
            this.render();
        });
      });
      observer.observe(this, { attributes: true });
    }
    connectedCallback() {
      this.render();
    }
    renderCss() {
      let styles = [];
      const attributes = this.getAttributeNames();
      for (let i = 0; i < attributes.length; i++) {
        const attributeName = attributes[i];
        const [attr, psuedo] = attributeName.split(":");
        const [prop, bp = "0"] = attr.split("--");
        const value = this.getAttribute(attributeName);
        styles.push([bp, prop, value, psuedo]);
      }
      const renderedStyles = styles.sort((a) => a[3] ? 1 : -1).sort((a, b) => Number(a[0]) - Number(b[0])).map(
        ([bp, prop, val, psuedo]) => `@media (min-width: ${bp}px) { :host${psuedo ? `:${psuedo}` : ""} { ${prop}:${val}; }}`
      ).join("\n");
      return renderedStyles;
    }
    render() {
      this.styleSheet.replace(this.renderCss());
      this.dispatchEvent(new CustomEvent("rendered"));
    }
  };
  customElements.define("dx-text", DomxText);
})();
//# sourceMappingURL=dx-text.js.map
