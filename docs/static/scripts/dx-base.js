"use strict";
(() => {
  // src/components/dx-base.ts
  var DomxBase = class extends HTMLElement {
    constructor() {
      super();
      this.baseStyles = [];
      this.props = [];
      this.rendered = false;
      this.styleSheet = new CSSStyleSheet();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = "<slot></slot>";
      this.shadowRoot.adoptedStyleSheets = [this.styleSheet];
      this.render = this.render.bind(this);
      this.registerEvents = this.registerEvents.bind(this);
      this.renderCss = this.renderCss.bind(this);
      this.getStylesFromEl = this.getStylesFromEl.bind(this);
    }
    async connectedCallback() {
      await this.render();
      await this.registerEvents();
      this.dispatchEvent(new CustomEvent("rendered"));
      this.rendered = true;
    }
    renderCss(styles) {
      const renderedStyles = styles.sort((a) => a[3] ? 1 : -1).sort((a, b) => Number(a[0]) - Number(b[0])).map(([bp = "0", prop, val, psuedo, sub]) => {
        const subSelector = sub ?? "";
        return `@media (min-width: ${bp}px) { :host${psuedo ? `(:${psuedo}) ${subSelector}` : subSelector} { ${prop}:${val}; }}`;
      }).join("\n");
      return renderedStyles;
    }
    getStylesFromEl(el, subSelector, filterList = []) {
      return el.getAttributeNames().filter((attr) => !this.props.includes(attr) && !attr.includes("onclick:") && !filterList.includes(attr)).map((attributeName) => {
        const [attr, psuedo] = attributeName.split(":");
        const [prop, bp] = attr.split("--");
        const value = el.getAttribute(attributeName) ?? "";
        return [bp, prop, value, psuedo, subSelector];
      });
    }
    async registerEvents() {
    }
    async render() {
    }
  };
})();
//# sourceMappingURL=dx-base.js.map
