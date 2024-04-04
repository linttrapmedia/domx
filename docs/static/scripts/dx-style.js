"use strict";
(() => {
  // src/components/dx-style.ts
  var classMap = {
    layout: {
      cont: "container",
      "box-sz": "box-sizing",
      disp: "display",
      flt: "float",
      clr: "clear",
      isol: "isolation",
      "obj-fit": "object-fit",
      "obj-pos": "object-position",
      ovfl: "overflow",
      ovscr: "overscroll-behavior",
      pos: "position",
      t: "top",
      r: "right",
      b: "bottom",
      l: "left",
      inset: "inset",
      vis: "visibility",
      z: "z-index",
      spc: "space",
      div: "divide",
      grd: "grid",
      flx: "flex",
      ord: "order"
    },
    flexbox: {
      "fx-dir": "flex-direction",
      "fx-wrap": "flex-wrap",
      "fx-flx": "flex",
      "fx-grow": "flex-grow",
      "fx-shrink": "flex-shrink",
      "fx-items": "align-items",
      "fx-content": "align-content",
      "fx-self": "align-self",
      "fx-justify": "justify-content",
      "fx-gap": "gap"
    },
    grid: {
      "gd-cols": "grid-template-columns",
      "gd-col": "grid-column",
      "gd-rows": "grid-template-rows",
      "gd-row": "grid-row",
      "gd-auto-flow": "grid-auto-flow",
      "gd-auto-cols": "grid-auto-columns",
      "gd-auto-rows": "grid-auto-rows",
      "gd-gap": "gap",
      "gd-row-gap": "row-gap",
      "gd-col-gap": "column-gap"
    },
    spacing: {
      "p-pd": "padding",
      "m-mg": "margin",
      "spc-spc": "space-between"
    },
    sizing: {
      "w-wd": "width",
      "w-min-w": "min-width",
      "w-max-w": "max-width",
      "h-ht": "height",
      "h-min-h": "min-height",
      "h-max-h": "max-height"
    },
    typography: {
      "fnt-fam": "font-family",
      "fnt-sz": "font-size",
      "fnt-smth": "font-smoothing",
      "fnt-style": "font-style",
      "fnt-weight": "font-weight",
      "fnt-var-num": "font-variant-numeric",
      "fnt-spc": "letter-spacing",
      "fnt-ht": "line-height",
      "fnt-lst-sty": "list-style-type",
      "fnt-lst-pos": "list-style-position",
      "fnt-plc-clr": "placeholder-color",
      "fnt-plc-op": "placeholder-opacity",
      "fnt-align": "text-align",
      "fnt-clr": "text-color",
      "fnt-op": "text-opacity",
      "fnt-dec": "text-decoration",
      "fnt-transf": "text-transform",
      "fnt-ovfl": "text-overflow",
      "fnt-align-vert": "vertical-align",
      "fnt-whtspc": "whitespace",
      "fnt-brk": "word-break"
    },
    background: {
      "bg-clr": "background-color",
      "bg-op": "background-opacity",
      "bg-pos": "background-position",
      "bg-sz": "background-size",
      "bg-rep": "background-repeat",
      "bg-att": "background-attachment",
      "bg-img": "background-image",
      "bg-clip": "background-clip",
      "bg-origin": "background-origin",
      "bg-grad": "gradient-color-stops"
    },
    borders: {
      "bd-wd": "border-width",
      "bd-clr": "border-color",
      "bd-op": "border-opacity",
      "bd-style": "border-style",
      "rd-rad": "border-radius",
      "bd-div-wd": "divide-width",
      "bd-div-clr": "divide-color",
      "bd-div-op": "divide-opacity",
      "bd-div-style": "divide-style",
      "bd-rng-wd": "ring-width",
      "bd-rng-clr": "ring-color",
      "bd-rng-op": "ring-opacity",
      "bd-rng-off-wd": "ring-offset-width",
      "bd-rng-off-clr": "ring-offset-color"
    },
    effects: {
      "sh-box": "box-shadow",
      "op-op": "opacity",
      "mb-blend": "mix-blend-mode",
      "fltr-fltr": "filter",
      "bckdrp-bckdrp": "backdrop-filter"
    },
    transforms: {
      "tf-scale": "scale",
      "tf-rotate": "rotate",
      "tf-translate": "translate",
      "tf-skew": "skew",
      "tf-origin": "transform-origin"
    },
    transitions: {
      "trn-prop": "transition-property",
      "trn-dur": "transition-duration",
      "trn-timing": "transition-timing-function",
      "trn-delay": "transition-delay",
      "anim-anim": "animation"
    },
    interactivity: {
      "cur-cursor": "cursor",
      "out-outline": "outline",
      "ptr-events": "pointer-events",
      "rsz-resize": "resize",
      "scr-behav": "scroll-behavior",
      "scr-snap-type": "scroll-snap-type",
      "scr-snap-align": "scroll-snap-align",
      "scr-snap-stop": "scroll-snap-stop",
      "scr-mrgn": "scroll-margin",
      "scr-pdng": "scroll-padding",
      "usr-select": "user-select"
    },
    svg: {
      "fl-fill": "fill",
      "str-stroke": "stroke",
      "str-width": "stroke-width"
    },
    accessibility: {
      "sr-screen": "screen-readers"
    }
  };
  if (!window.DX)
    window.DX = {};
  window.DX.style = {
    instance: null,
    create: () => document.createElement("dx-style"),
    read: () => window.DX.style.instance,
    update: (props) => {
      for (const key in props) {
        window.DX.style.instance.setAttribute(key, props[key]);
      }
    },
    delete: () => window.DX.style.instance.remove(),
    docs: () => {
      console.group("dx-style:");
      console.log(" A custom element that dynamically generates globally available tailwind-esque utility classes");
      Object.entries(classMap).forEach(([category, entry]) => {
        console.group(category);
        Object.entries(entry).forEach(([key, value]) => {
          console.log(`.${key}`, `(${value})`);
        });
        console.groupEnd();
      });
      console.groupEnd();
    }
  };
  var DomxStyle = class extends HTMLElement {
    constructor() {
      super();
      this.styleSheet = new CSSStyleSheet();
      this.attachStyleSheet = this.attachStyleSheet.bind(this);
      this.renderAll = this.renderAll.bind(this);
      this.renderColors = this.renderColors.bind(this);
      this.generateStyle = this.generateStyle.bind(this);
      this.startObserver = this.startObserver.bind(this);
    }
    connectedCallback() {
      this.startObserver();
      this.attachStyleSheet();
      this.renderAll();
      window.DX.style.instance = this;
    }
    attachStyleSheet() {
      document.adoptedStyleSheets = [this.styleSheet, ...document.adoptedStyleSheets];
    }
    generateStyle(selector, rules) {
      this.styleSheet.insertRule(`.${selector} { ${rules} }`);
      this.styleSheet.insertRule(`.${selector}\\:hover:hover { ${rules} }`);
    }
    renderAll() {
      this.styleSheet.replaceSync("");
      this.renderColors();
    }
    renderColors() {
      const colorAttrs = this.getAttributeNames().filter((attr) => attr.startsWith("color-"));
      for (const colorAttr of colorAttrs) {
        const colorVal = this.getAttribute(colorAttr) || "";
        const colorName = colorAttr.replace("color-", "");
        this.generateStyle(`color-${colorName}`, `color: ${colorVal};`);
        this.generateStyle(`color-bg-${colorName}`, `background-color: ${colorVal};`);
      }
    }
    startObserver() {
      new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "attributes")
            this.renderAll();
        }
      }).observe(this, { attributes: true });
    }
  };
  customElements.define("dx-style", DomxStyle);
})();
//# sourceMappingURL=dx-style.js.map
