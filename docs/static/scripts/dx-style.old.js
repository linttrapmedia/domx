"use strict";
(() => {
  // node_modules/@linttrap/oem/src/html/HTML.ts
  var selectorMap = /* @__PURE__ */ new Map();
  var matchObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0 && mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element) {
            for (const [selector, [props, config]] of selectorMap.entries()) {
              const els = node.querySelectorAll(selector);
              for (const el of els)
                HtmlTag(el, props, config);
            }
          }
        }
      }
    });
  });
  matchObserver.observe(document, { attributes: true, childList: true, subtree: true });
  function AdoptElBySelector(selector, watch = true, config) {
    return (...props) => {
      if (watch)
        selectorMap.set(selector, [props, config]);
      const els = document.querySelectorAll(selector);
      for (const el of els)
        HtmlTag(el, props, config);
    };
  }
  function AdoptElByInstance(el, config) {
    return (...props) => HtmlTag(el, props, config);
  }
  function CreateEl(tag, config) {
    return (...props) => {
      const ns = "http://www.w3.org/1999/xhtml";
      const el = document.createElementNS(ns, tag);
      return HtmlTag(el, props, config);
    };
  }
  function HtmlTag(el, traits = [], config = {}) {
    traits.forEach(([trait, ...args]) => config[trait](el, ...args));
    function fn(...children) {
      children.forEach((child) => el.append(child));
      return el;
    }
    return fn;
  }
  function HTML(config) {
    return new Proxy(
      {},
      {
        get: (_, prop) => {
          if (prop === "el")
            return (el) => AdoptElByInstance(el, config);
          if (prop === "$el")
            return (selector, watch) => AdoptElBySelector(selector, watch, config);
          return CreateEl(prop, config);
        }
      }
    );
  }

  // src/components/dx-style.old.ts
  var html = HTML({
    style: (el, prop, val, breakpoint, psuedo) => {
      const apply = () => {
        const isInBreakpoint = window.innerWidth > breakpoint;
        if (!isInBreakpoint)
          return;
        el.style[prop] = val;
      };
      window.addEventListener("resize", apply);
      if (psuedo)
        el.addEventListener(psuedo, apply);
      if (!psuedo)
        apply();
    }
  });
  function register(element) {
    const styleTraits = element.getAttributeNames().filter((attr) => attr.startsWith("dx-style:")).map((attr) => {
      const values = element.getAttribute(attr)?.split(" ");
      return values?.map((v) => {
        const [, prop] = attr.split(":");
        const [bpVal, bp] = v.split("@");
        const [val, psuedo] = bpVal.split(":");
        const _prop = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        return ["style", _prop, val, Number(bp ?? "0"), psuedo];
      });
    }).flat();
    html.el(element)(...styleTraits);
  }
  function registerAll(container) {
    const els = container.querySelectorAll(`[dx-style]`);
    els.forEach(register);
  }
  document.addEventListener("DOMContentLoaded", function() {
    registerAll(document.body);
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0 && mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element)
              registerAll(node);
          });
        }
      });
    }).observe(document, { attributes: false, childList: true, subtree: true });
  });
})();
//# sourceMappingURL=dx-style.old.js.map
