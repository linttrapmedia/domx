document.addEventListener("DOMContentLoaded", function () {
  // register component
  function register(el: HTMLElement) {
    const tagName = el.getAttribute("is")!;
    const attributes = el.attributes;
    const tag = document.createElement(tagName);
    // transfer attributes
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      if (attr.name === "is") continue;
      tag.setAttribute(attr.name, attr.value);
    }
    // transfer text content
    tag.textContent = el.textContent;
    el.replaceWith(tag);
  }

  // dx element check
  function isDxElement(el: Element) {
    return el.getAttribute("is")?.startsWith("dx-") ?? false;
  }

  // auto register onload
  const elements = document.querySelectorAll("[is]");
  elements.forEach((el) => {
    if (isDxElement(el)) register(el as HTMLElement);
  });

  // auto register on mutation
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0 && mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && isDxElement(node as HTMLElement)) {
            register(node as HTMLElement);
          }
        });
      }
    });
  });
  observer.observe(this, { attributes: false, childList: true, subtree: true });
});
