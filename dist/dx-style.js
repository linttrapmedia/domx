"use strict";
(() => {
  // src/components/dx-style.ts
  var DomxStyle = class extends HTMLElement {
    constructor() {
      super();
      this.baseStyles = [["display", "inherit"]];
      this.slottedStyles = [];
      this.psuedoStyles = {};
      this.styleSheet = new CSSStyleSheet();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = "<slot></slot>";
      this.render = this.render.bind(this);
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
      window.addEventListener("resize", this.render);
    }
    disconnectedCallback() {
      window.removeEventListener("resize", this.render);
    }
    render() {
      let slottedStylesList = this.slottedStyles;
      let psuedoStylesList = {};
      this.getAttributeNames().forEach((attributeName) => {
        const [style, bp] = attributeName.split("--");
        const [attr, psuedo] = style.split(":");
        const breakpoint = Number(bp ?? 0);
        if (window.innerWidth < breakpoint)
          return;
        const value = this.getAttribute(attributeName);
        if (psuedo) {
          if (!psuedoStylesList[psuedo])
            psuedoStylesList[psuedo] = [];
          psuedoStylesList[psuedo].push([attr, value]);
        } else {
          slottedStylesList.push([attr, value]);
        }
      });
      const hostStyles = `:host{ ${this.baseStyles.map(([attr, value]) => `${attr}:${value};`).join("")}}`;
      const hostSlottedStyles = `::slotted(*){ ${slottedStylesList.map(([attr, value]) => `${attr}:${value} !important;`).join("")}}`;
      const hostSlottedPsuedoStyles = Object.entries(psuedoStylesList).map(([psuedo, styles]) => {
        const _styles = styles.map(([attr, value]) => `${attr}:${value} !important;`).join("");
        return `::slotted(*:${psuedo}) { ${_styles} }`;
      }).join("");
      this.styleSheet.replace(
        hostStyles + hostSlottedStyles + hostSlottedPsuedoStyles
      );
    }
  };
  customElements.define("dx-style", DomxStyle);
})();
