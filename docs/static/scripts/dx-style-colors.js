"use strict";
(() => {
  // src/components/dx-style-colors.ts
  var _DomxStyleColors = class extends HTMLElement {
    constructor() {
      super();
      this.styleSheet = new CSSStyleSheet();
      this.props = ["id"];
      this.render = this.render.bind(this);
    }
    static create() {
      document.createElement("dx-style-colors");
    }
    static read(id) {
      return _DomxStyleColors.instances.find((el) => el.id === id);
    }
    static update(id, props) {
      for (const key in props)
        _DomxStyleColors.read(id).setAttribute(key, props[key]);
    }
    static delete(el) {
      el.remove();
    }
    static list(filter = void 0) {
      if (!filter)
        return _DomxStyleColors.instances;
      return _DomxStyleColors.instances.filter((el) => el.matches(filter));
    }
    connectedCallback() {
      if (this.hasChildNodes()) {
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = "<slot></slot>";
        this.shadowRoot.adoptedStyleSheets = [this.styleSheet];
      } else {
        document.adoptedStyleSheets = [this.styleSheet];
      }
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "attributes")
            this.render();
        });
      });
      observer.observe(this, { attributes: true });
      _DomxStyleColors.instances.push(this);
      this.render();
    }
    render() {
      const colorAttrs = this.getAttributeNames().filter((attr) => !this.props.includes(attr));
      const wrapSelector = (sel) => this.hasChildNodes() ? `::slotted(${sel})` : sel;
      let styles = ``;
      for (const colorAttr of colorAttrs) {
        const colorVal = this.getAttribute(colorAttr) || "";
        const colorVar = `dx-style-color-${colorAttr}`;
        styles += `${this.hasChildNodes() ? ":host" : ":root"} { --${colorVar}:${colorVal}; }
`;
        styles += `${wrapSelector(`.txt-${colorAttr}`)} { color: var(--${colorVar}); }
`;
        styles += `${wrapSelector(`.txt-${colorAttr}\\:hover:hover`)}  { color: var(--${colorVar}); }
`;
        styles += `${wrapSelector(`.bg-${colorAttr}`)}  { background-color: var(--${colorVar}); }
`;
        styles += `${wrapSelector(`.bg-${colorAttr}\\:hover:hover`)}  { background-color: var(--${colorVar}); }
`;
      }
      this.styleSheet.replaceSync(styles);
    }
  };
  var DomxStyleColors = _DomxStyleColors;
  DomxStyleColors.instances = [];
  customElements.define("dx-style-colors", DomxStyleColors);
  var win = window;
  if (!win.DX)
    win.DX = {};
  if (!win.DX.style)
    win.DX.style = {};
  win.DX.style.colors = DomxStyleColors;
})();
//# sourceMappingURL=dx-style-colors.js.map
