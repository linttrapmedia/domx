"use strict";
(() => {
  // src/helpers.ts
  function cssObjectToString(css) {
    let str = "";
    for (let key in css) {
      str += `${key}: ${css[key]};`;
    }
    return str;
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
  function attachTemplate(el, template) {
    const templateEl = document.createElement("template");
    templateEl.innerHTML = template;
    const node = templateEl.content.cloneNode(true);
    el.shadowRoot.appendChild(node);
    return node;
  }

  // src/dx-box.ts
  var DomBox = class extends HTMLElement {
    constructor() {
      super();
      this.baseStyles = `
  box-sizing: border-box;
  display: flex; 
  transition: padding 0.25s ease-in-out;`;
      attachShadow(this, { mode: "open" });
      this.styleSheet = attachStyles(this, "");
      this.template = attachTemplate(this, `<slot></slot>`);
      this.render = this.render.bind(this);
    }
    connectedCallback() {
      const bp = this.parentElement?.closest("dx-mq");
      bp.subscribe(this);
      this.render(bp.calculateBreakpoint());
    }
    render(breakpoint) {
      const styles = {};
      [
        "align-items",
        "border-color",
        "border-radius",
        "border-style",
        "border-width",
        "flex-direction",
        "flex-wrap",
        "flex-flow",
        "gap",
        "margin",
        "padding",
        "max-width"
      ].forEach((key) => {
        if (this.hasAttribute(key))
          styles[key] = this.getAttribute(key);
        if (this.hasAttribute(`${breakpoint}:${key}`))
          styles[key] = this.getAttribute(`${breakpoint}:${key}`);
      });
      this.styleSheet.replace(`:host { 
      ${this.baseStyles}
      ${cssObjectToString(styles)}
    }`);
      if (this.hasAttribute("debug"))
        console.log(styles);
    }
  };
  customElements.define("dx-box", DomBox);
  var DomCol = class extends DomBox {
    constructor() {
      super(...arguments);
      this.baseStyles = `
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: padding 0.25s ease-in-out;`;
    }
  };
  customElements.define("dx-col", DomCol);
  var DomRow = class extends DomBox {
    constructor() {
      super(...arguments);
      this.baseStyles = `
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  transition: padding 0.25s ease-in-out;`;
    }
  };
  customElements.define("dx-row", DomRow);
})();
//# sourceMappingURL=dx-box.js.map
