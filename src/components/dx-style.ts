const styleSheet = new CSSStyleSheet();

const applyStyles = (el: Element) => {
  let dxStyleId = el.getAttribute("dx-style");
  if (!dxStyleId) {
    dxStyleId = Math.random().toString(36).substring(7);
    el.setAttribute("dx-style", dxStyleId);
  }

  const styles = el
    .getAttributeNames()
    .filter((attr) => attr.startsWith("dx-style:"))
    .map((attr) => {
      const val = el.getAttribute(attr);
      const [bpAttr, bp = 0] = attr.split("--");
      const [_, prop, psuedo] = bpAttr.split(":");
      const rule = `@media (min-width: ${bp}px) { [dx-style="${dxStyleId}"]${
        psuedo ? `:${psuedo}` : ""
      } { ${prop}: ${val}; } }`;
      return rule;
    })
    .sort()
    .forEach((rule) => {
      styleSheet.insertRule(rule);
      console.log(rule);
    });

  console.log(el, styles);
};

const clearStyles = (el: Element) => {};

document.addEventListener("DOMContentLoaded", () => {
  const dxStyles = document.querySelectorAll("[dx-style]");
  dxStyles.forEach(applyStyles);
  document.adoptedStyleSheets = [styleSheet];
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes" && mutation.attributeName === "dx-style") {
        clearStyles(mutation.target as Element);
      }
      if (mutation.type === "childList" && mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && (node as Element).hasAttribute("dx-style")) {
            applyStyles(node as Element);
          }
        });
      }
    }
  });
  observer.observe(document.body, { attributes: true, childList: true, subtree: true });
});

// class DomxStyle extends HTMLElement {
//   private styleSheet: CSSStyleSheet = new CSSStyleSheet();
//   constructor() {
//     super();
//     this.render = this.render.bind(this);
//     this.reduceAttrs = this.reduceAttrs.bind(this);
//     this.generateSelector = this.generateSelector.bind(this);
//   }
//   connectedCallback() {
//     document.adoptedStyleSheets = [this.styleSheet];
//     const observer = new MutationObserver((mutations) => {
//       mutations.forEach((mutation) => {
//         if (mutation.type === "attributes") this.render();
//       });
//     });
//     observer.observe(this, { attributes: true });
//     this.render();
//   }
//   generateSelector(arrays: string[][]) {
//     const combinations: string[] = [];

//     // Function to recursively generate combinations
//     function recurse(prefix: string, index: number) {
//       if (index < arrays.length) {
//         for (const item of arrays[index]) {
//           const newPrefix = prefix ? `${prefix}\\:${item}` : item;
//           combinations.push(newPrefix);
//           recurse(newPrefix, index + 1);
//         }
//       }
//     }

//     // Generate combinations for each array
//     for (let i = 0; i < arrays.length; i++) {
//       recurse("", i);
//     }

//     return combinations;
//   }
//   reduceAttrs(prefix: string) {
//     const attrs = this.getAttributeNames().filter((attr) => attr.startsWith(prefix));
//     return attrs.reduce((acc, attr) => {
//       const mod = attr.replace(prefix, "");
//       acc[mod] = this.getAttribute(attr);
//       return acc;
//     }, {} as any);
//   }
//   render() {
//     let styles = ``;
//     const wrapSelector = (sel: string) => (this.hasChildNodes() ? `::slotted(${sel})` : sel);
//     const colorAttrs = this.reduceAttrs("color-");
//     const breakpointAttrs = this.reduceAttrs("breakpoint-");
//     const psuedoAttrs = this.reduceAttrs("psuedo-");
//     const modifiers = this.generateSelector([Object.keys(breakpointAttrs), Object.keys(psuedoAttrs)]);

//     // colors
//     for (const colorAttr in colorAttrs) {
//       const colorVal = colorAttrs[colorAttr];
//       const colorVar = `dx-style-color-${colorAttr}`;
//       styles += `${this.hasChildNodes() ? ":host" : ":root"} { --${colorVar}:${colorVal}; }\n`; // needed for local scope
//       styles += `${wrapSelector(`.txt-${colorAttr}`)} { color: var(--${colorVar}); }\n`;
//       styles += `${wrapSelector(`.hover\\:txt-${colorAttr}:hover`)}  { color: var(--${colorVar}); }\n`;
//       styles += `${wrapSelector(`.bg-${colorAttr}`)}  { background-color: var(--${colorVar}); }\n`;
//       styles += `${wrapSelector(`.hover\\:bg-${colorAttr}:hover`)}  { background-color: var(--${colorVar}); }\n`;
//     }

//     // padding

//     // replace styles
//     console.log(styles);
//     this.styleSheet.replaceSync(styles);
//   }
// }

// customElements.define("dx-style", DomxStyle);

// const win = window as any;
// if (!win.DX) win.DX = {};
// if (!win.DX.style) win.DX.style = {};
// win.DX.style = DomxStyle;
