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
  function attachTemplate(el, template) {
    const templateEl = document.createElement("template");
    templateEl.innerHTML = template;
    const node = templateEl.content.cloneNode(true);
    el.shadowRoot.appendChild(node);
    return node;
  }
})();
//# sourceMappingURL=helpers.js.map
