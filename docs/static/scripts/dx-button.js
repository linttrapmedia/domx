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

  // src/components/dx-button.ts
  var DomxButton = class extends DomxBase {
    constructor() {
      super();
      this.baseStyles = [
        ["0", "align-items", "center"],
        ["0", "background-color", "black"],
        ["0", "background-color", "white", "hover"],
        ["0", "border", "1px solid white"],
        ["0", "color", "white"],
        ["0", "color", "black", "hover"],
        ["0", "cursor", "pointer"],
        ["0", "display", "inline-flex"],
        ["0", "justify-content", "center"],
        ["0", "padding", "0.5rem 1rem"],
        ["0", "width", "max-content"]
      ];
      this.props = ["id", "oclick"];
      this.registerEvents = this.registerEvents.bind(this);
    }
    async registerEvents() {
      const DxStateOnClicks = this.getAttributeNames().filter((attr) => attr.startsWith("onclick:"));
      DxStateOnClicks.forEach((attr) => {
        const value = this.getAttribute(attr) ?? "";
        this.addEventListener("click", () => {
          const [_, state] = attr.split(":");
          const transformation = value.split(",");
          const stateEl = document.querySelector(`dx-state[name=${state}]`);
          const [trait] = transformation;
          stateEl.transform(trait, transformation);
        });
      });
    }
    async render() {
      const baseStyles = this.renderCss(this.baseStyles);
      const buttonStyles = this.renderCss(this.getStylesFromEl(this));
      const buttonLabel = this.querySelector("dx-button-label");
      let buttonLabelStyles = "";
      if (buttonLabel) {
        await customElements.whenDefined("dx-button-label");
        const buttonLabelStyleList = [...this.getStylesFromEl(buttonLabel)];
        buttonLabelStyles = this.renderCss(buttonLabelStyleList);
      }
      this.styleSheet.replace(baseStyles + buttonStyles + buttonLabelStyles);
      await this.registerEvents();
    }
  };
  customElements.define("dx-button", DomxButton);
  var DomxButtonLabel = class extends DomxBase {
    constructor() {
      super();
    }
  };
  customElements.define("dx-button-label", DomxButtonLabel);
})();
//# sourceMappingURL=dx-button.js.map
