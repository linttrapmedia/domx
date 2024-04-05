"use strict";
(() => {
  // src/components/dx-colors.ts
  if (!window.DX)
    window.DX = {};
  window.DX.colors = {
    instance: null,
    create: () => document.createElement("dx-colors"),
    read: () => window.DX.colors.instance,
    update: (props) => {
      for (const key in props)
        window.DX.colors.instance.setAttribute(key, props[key]);
    },
    delete: () => window.DX.colors.instance.remove(),
    docs: () => {
      const instance = window.DX.colors.instance;
      console.group("dx-colors:");
      console.log("A custom element that generates globally available utility classes for colors");
      console.group("Text:");
      instance.getAttributeNames().forEach((attr) => {
        console.log(`.txt-${attr}`, `(${instance.getAttribute(attr)})`);
        console.log(`.txt-${attr}:hover`, `(${instance.getAttribute(attr)} on hover)`);
      });
      console.groupEnd();
      console.group("Backgrounds:");
      instance.getAttributeNames().forEach((attr) => {
        console.log(`.bg-${attr}`, `(${instance.getAttribute(attr)})`);
        console.log(`.bg-${attr}:hover`, `(${instance.getAttribute(attr)} on hover)`);
      });
      console.groupEnd();
      console.groupEnd();
    }
  };
  var DomxStyleColors = class extends HTMLElement {
    constructor() {
      super();
      this.styleSheet = new CSSStyleSheet();
      this.attachStyleSheet = this.attachStyleSheet.bind(this);
      this.render = this.render.bind(this);
      this.generateStyle = this.generateStyle.bind(this);
      this.startObserver = this.startObserver.bind(this);
    }
    connectedCallback() {
      this.startObserver();
      this.attachStyleSheet();
      this.render();
      window.DX.colors.instance = this;
    }
    attachStyleSheet() {
      document.adoptedStyleSheets = [this.styleSheet, ...document.adoptedStyleSheets];
    }
    generateStyle(selector, rules) {
      this.styleSheet.insertRule(`.${selector} { ${rules} }`);
      this.styleSheet.insertRule(`.${selector}\\:hover:hover { ${rules} }`);
    }
    render() {
      this.styleSheet.replaceSync("");
      const colorAttrs = this.getAttributeNames();
      for (const colorAttr of colorAttrs) {
        const colorVal = this.getAttribute(colorAttr) || "";
        const colorName = colorAttr.replace("color-", "");
        this.generateStyle(`txt-${colorName}`, `color: ${colorVal};`);
        this.generateStyle(`bg-${colorName}`, `background-color: ${colorVal};`);
      }
    }
    startObserver() {
      new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "attributes")
            this.render();
        }
      }).observe(this, { attributes: true });
    }
  };
  customElements.define("dx-style-colors", DomxStyleColors);
})();
//# sourceMappingURL=dx-colors.js.map
