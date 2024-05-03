"use strict";
(() => {
  // src/components/dx-style.ts
  var styleSheet = new CSSStyleSheet();
  var applyStyles = (el) => {
    let dxStyleId = el.getAttribute("dx-style");
    if (!dxStyleId) {
      dxStyleId = Math.random().toString(36).substring(7);
      el.setAttribute("dx-style", dxStyleId);
    }
    const styles = el.getAttributeNames().filter((attr) => attr.startsWith("dx-style:")).map((attr) => {
      const val = el.getAttribute(attr);
      const [bpAttr, bp = 0] = attr.split("--");
      const [_, prop, psuedo] = bpAttr.split(":");
      const rule = `@media (min-width: ${bp}px) { [dx-style="${dxStyleId}"]${psuedo ? `:${psuedo}` : ""} { ${prop}: ${val}; } }`;
      return rule;
    }).sort().forEach((rule) => {
      styleSheet.insertRule(rule);
      console.log(rule);
    });
    console.log(el, styles);
  };
  var clearStyles = (el) => {
  };
  document.addEventListener("DOMContentLoaded", () => {
    const dxStyles = document.querySelectorAll("[dx-style]");
    dxStyles.forEach(applyStyles);
    document.adoptedStyleSheets = [styleSheet];
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "dx-style") {
          clearStyles(mutation.target);
        }
        if (mutation.type === "childList" && mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute("dx-style")) {
              applyStyles(node);
            }
          });
        }
      }
    });
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
  });
})();
//# sourceMappingURL=dx-style.js.map
