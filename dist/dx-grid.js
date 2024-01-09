"use strict";
(() => {
  // src/components/dx-grid.ts
  var DomxGrid = class extends HTMLElement {
    constructor() {
      super();
      this.baseStyles = [
        ["box-sizing", "border-box"],
        ["display", "grid"]
      ];
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
      let styles = this.baseStyles;
      let psuedoStyles = {};
      this.getAttributeNames().forEach((attributeName) => {
        const [style, bp] = attributeName.split("--");
        const [attr, psuedo] = style.split(":");
        const breakpoint = Number(bp ?? 0);
        if (window.innerWidth < breakpoint)
          return;
        const value = this.getAttribute(attributeName);
        if (psuedo) {
          if (!psuedoStyles[psuedo])
            psuedoStyles[psuedo] = [];
          psuedoStyles[psuedo].push([attr, value]);
        } else {
          styles.push([attr, value]);
        }
      });
      const hostStyles = `:host{ ${styles.map(([attr, value]) => `${attr}:${value};`).join("")}}`;
      const hostPsuedoStyles = Object.entries(psuedoStyles).map(([psuedo, styles2]) => {
        const _styles = styles2.map(([attr, value]) => `${attr}:${value};`).join("");
        return `:host(:${psuedo}) { ${_styles} }`;
      }).join("");
      this.styleSheet.replace(hostStyles + hostPsuedoStyles);
    }
  };
  customElements.define("dx-grid", DomxGrid);
})();
