"use strict";
(() => {
  // src/helpers.ts
  function mergeByIndex(arr1, arr2) {
    let merged = [...arr1];
    for (let i = 0; i < arr2.length; i++) {
      if (i < merged.length) {
        merged[i] = arr2[i];
      } else {
        merged.push(arr2[i]);
      }
    }
    return merged;
  }
  function attachShadow(el, init) {
    el.attachShadow(init);
  }
  function attachStyles(el, styles) {
    let sheet = new CSSStyleSheet();
    sheet.replace(styles);
    el.shadowRoot.adoptedStyleSheets = [sheet];
    return sheet;
  }
  function attachTemplate(el, template2) {
    const templateEl = document.createElement("template");
    templateEl.innerHTML = template2;
    const node = templateEl.content.cloneNode(true);
    el.shadowRoot.appendChild(node);
    return node;
  }

  // src/dx-text.ts
  var baseStyles = `
  font-size: var(--dx-text-size, var(--dx-theme-font-size-medium, 16px));
  color: var(--dx-theme-text-color);
`;
  var fontFamilyMap = {
    primary: "var(--dx-text-font, var(--dx-theme-font-primary, Arial))",
    secondary: "var(--dx-text-font, var(--dx-theme-font-secondary, Arial))",
    tertiary: "var(--dx-text-font, var(--dx-theme-font-tertiery, Arial))"
  };
  var colorMap = {
    black: "var(--dx-text-color-black, var(--dx-theme-color-black, black))",
    danger: "var(--dx-text-color-danger, var(--dx-theme-danger-color, red))",
    info: "var(--dx-text-color-info, var(--dx-theme-info-color, blue))",
    primary: "var(--dx-text-color-primary, var(--dx-theme-primary-color, blue))",
    secondary: "var(--dx-text-color-secondary, var(--dx-theme-secondary-color, green))",
    success: "var(--dx-text-color-success, var(--dx-theme-success-color, green))",
    tertiary: "var(--dx-text-color-tertiary, var(--dx-theme-tertiary-color, red))",
    warning: "var(--dx-text-color-warning, var(--dx-theme-warning-color, yellow))",
    white: "var(--dx-text-color-white, var(--dx-theme-color-white, white))"
  };
  var template = `<slot></slot>`;
  var DomText = class extends HTMLElement {
    constructor() {
      super();
      this.align = [];
      this.breakpoints = [0, 960, 1440];
      this.color = [""];
      this.font = ["primary"];
      this.size = [""];
      this.shadow = [];
      this.spacing = [];
      this.oblique = [];
      this.opacity = [];
      this.weight = [];
      attachShadow(this, { mode: "open" });
      attachTemplate(this, template);
      this.render = this.render.bind(this);
      this.setupAttributes = this.setupAttributes.bind(this);
      this.setupStyleSheet = this.setupStyleSheet.bind(this);
    }
    connectedCallback() {
      this.setupAttributes().setupStyleSheet().render();
      window.addEventListener("resize", this.render);
    }
    disconnectedCallback() {
      window.removeEventListener("resize", this.render);
    }
    render() {
      const width = window.innerWidth;
      let styles = "";
      this.breakpoints.forEach((bp, i) => {
        if (width > bp) {
          if (this.align[i])
            styles += `text-align: ${this.align[i]};`;
          if (this.color[i])
            styles += `color: ${colorMap[this.color[i]]};`;
          if (this.font[i])
            styles += `font-family: ${fontFamilyMap[this.font[i]]};`;
          if (this.oblique[i])
            styles += `font-style: ${this.oblique[i] === "true" ? "oblique" : "normal"}`;
          if (this.opacity[i])
            styles += `opacity: ${this.opacity[i]};`;
          if (this.shadow[i])
            styles += `text-shadow: ${this.shadow[i]};`;
          if (this.size[i])
            styles += `font-size: ${this.size[i]};`;
          if (this.spacing[i])
            styles += `letter-spacing: ${this.spacing[i]};`;
          if (this.weight[i])
            styles += `font-weight: ${this.weight[i]};`;
        }
        this.styleSheet.replace(`:host {  ${baseStyles} ${styles} }`);
      });
    }
    setupAttributes() {
      DomText.observedAttributes.forEach((attr) => {
        const val = this.getAttribute(attr);
        if (!val)
          return;
        this[attr] = mergeByIndex(this[attr], val.split(","));
      });
      return this;
    }
    static get observedAttributes() {
      return [
        "align",
        "breakpoints",
        "color",
        "font",
        "oblique",
        "opacity",
        "shadow",
        "size",
        "spacing",
        "weight"
      ];
    }
    setupStyleSheet() {
      this.styleSheet = attachStyles(this, `:host { ${baseStyles} } `);
      return this;
    }
  };
  customElements.define("dx-text", DomText);
})();
//# sourceMappingURL=dx-text.js.map
