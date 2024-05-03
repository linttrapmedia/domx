"use strict";
(() => {
  // src/components/dx-style.x.ts
  var DomxStyleX = class extends HTMLElement {
    constructor() {
      super();
      this.styleSheet = new CSSStyleSheet();
      this.render = this.render.bind(this);
      this.reduceAttrs = this.reduceAttrs.bind(this);
      this.generateSelector = this.generateSelector.bind(this);
    }
    static create() {
      document.createElement("dx-style-colors");
    }
    static read(id) {
      return DomxStyle.instances.find((el) => el.id === id);
    }
    static update(id, props) {
      for (const key in props)
        DomxStyle.read(id).setAttribute(key, props[key]);
    }
    static delete(el) {
      el.remove();
    }
    static list(filter = void 0) {
      if (!filter)
        return DomxStyle.instances;
      return DomxStyle.instances.filter((el) => el.matches(filter));
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
      DomxStyle.instances.push(this);
      this.render();
    }
    generateSelector(arrays) {
      const combinations = [];
      function recurse(prefix, index) {
        if (index < arrays.length) {
          for (const item of arrays[index]) {
            const newPrefix = prefix ? `${prefix}\\:${item}` : item;
            combinations.push(newPrefix);
            recurse(newPrefix, index + 1);
          }
        }
      }
      for (let i = 0; i < arrays.length; i++) {
        recurse("", i);
      }
      return combinations;
    }
    reduceAttrs(prefix) {
      const attrs = this.getAttributeNames().filter((attr) => attr.startsWith(prefix));
      return attrs.reduce((acc, attr) => {
        const mod = attr.replace(prefix, "");
        acc[mod] = this.getAttribute(attr);
        return acc;
      }, {});
    }
    render() {
      let styles = ``;
      const wrapSelector = (sel) => this.hasChildNodes() ? `::slotted(${sel})` : sel;
      const colorAttrs = this.reduceAttrs("color-");
      const breakpointAttrs = this.reduceAttrs("breakpoint-");
      const psuedoAttrs = this.reduceAttrs("psuedo-");
      const modifiers = this.generateSelector([Object.keys(breakpointAttrs), Object.keys(psuedoAttrs)]);
      for (const colorAttr in colorAttrs) {
        const colorVal = colorAttrs[colorAttr];
        const colorVar = `dx-style-color-${colorAttr}`;
        styles += `${this.hasChildNodes() ? ":host" : ":root"} { --${colorVar}:${colorVal}; }
`;
        styles += `${wrapSelector(`.txt-${colorAttr}`)} { color: var(--${colorVar}); }
`;
        styles += `${wrapSelector(`.hover\\:txt-${colorAttr}:hover`)}  { color: var(--${colorVar}); }
`;
        styles += `${wrapSelector(`.bg-${colorAttr}`)}  { background-color: var(--${colorVar}); }
`;
        styles += `${wrapSelector(`.hover\\:bg-${colorAttr}:hover`)}  { background-color: var(--${colorVar}); }
`;
      }
      console.log(styles);
      this.styleSheet.replaceSync(styles);
    }
  };
  DomxStyleX.instances = [];
  customElements.define("dx-style", DomxStyle);
  var win = window;
  if (!win.DX)
    win.DX = {};
  if (!win.DX.style)
    win.DX.style = {};
  win.DX.style = DomxStyle;
})();
//# sourceMappingURL=dx-style.x.js.map
