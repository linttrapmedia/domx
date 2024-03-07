"use strict";
(() => {
  // src/components/dx-is.ts
  document.addEventListener("DOMContentLoaded", function() {
    function register(el) {
      const tagName = el.getAttribute("is");
      const attributes = el.attributes;
      const tag = document.createElement(tagName);
      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        if (attr.name === "is")
          continue;
        tag.setAttribute(attr.name, attr.value);
      }
      tag.textContent = el.textContent;
      el.replaceWith(tag);
    }
    function isDxElement(el) {
      return el.getAttribute("is")?.startsWith("dx-") ?? false;
    }
    const elements = document.querySelectorAll("[is]");
    elements.forEach((el) => {
      if (isDxElement(el))
        register(el);
    });
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0 && mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE && isDxElement(node)) {
              register(node);
            }
          });
        }
      });
    });
    observer.observe(this, { attributes: false, childList: true, subtree: true });
  });
})();
//# sourceMappingURL=dx-is.js.map
