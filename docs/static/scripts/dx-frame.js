"use strict";
(() => {
  // src/components/dx-frame.ts
  var DomxFrame = class extends HTMLElement {
    constructor() {
      super();
      this.behaviorAttributeNames = ["src", "allowfullscreen", "allow"];
      this.baseStyles = `:host { box-sizing: border-box; display: flex; }`;
      this.psuedoStyles = {};
      this.styleSheet = new CSSStyleSheet();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = "<slot></slot>";
      this.render = this.render.bind(this);
      this.renderCss = this.renderCss.bind(this);
      this.shadowRoot.adoptedStyleSheets = [this.styleSheet];
    }
    connectedCallback() {
      this.render();
    }
    renderCss(attributes = []) {
      let styles = [];
      for (let i = 0; i < attributes.length; i++) {
        const attributeName = attributes[i];
        const [attr, psuedo] = attributeName.split(":");
        const [prop, bp = "0"] = attr.split("--");
        const value = this.getAttribute(attributeName);
        styles.push([bp, prop, value, psuedo]);
      }
      const renderedStyles = styles.sort((a, b) => a[3] ? 1 : -1).sort((a, b) => Number(a[0]) - Number(b[0])).map(
        ([bp, prop, val, psuedo]) => `@media (min-width: ${bp}px) { :host ${psuedo ? `iframe:${psuedo}` : "iframe"} { ${prop}:${val}; }}`
      ).join("\n");
      return this.baseStyles + renderedStyles;
    }
    render() {
      this.innerHTML = "";
      const iframe = document.createElement("iframe");
      iframe.src = this.getAttribute("src");
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.frameBorder = "0";
      iframe.allowFullscreen = this.hasAttribute("allowfullscreen");
      iframe.allow = this.getAttribute("allow") || "";
      this.shadowRoot.appendChild(iframe);
      const styleAttributes = this.getAttributeNames().filter(
        (attr) => !this.behaviorAttributeNames.includes(attr)
      );
      this.styleSheet.replace(this.renderCss(styleAttributes));
    }
  };
  customElements.define("dx-frame", DomxFrame);
})();
//# sourceMappingURL=dx-frame.js.map
