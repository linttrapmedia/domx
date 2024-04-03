import { HTML } from "@linttrap/oem";

const html = HTML({
  style: (el: HTMLElement, prop: string, val: string, breakpoint: number, psuedo: string) => {
    const apply = () => {
      const isInBreakpoint = window.innerWidth > breakpoint;
      if (!isInBreakpoint) return;
      el.style[prop as any] = val as any;
    };
    window.addEventListener("resize", apply);
    if (psuedo) el.addEventListener(psuedo, apply);
    if (!psuedo) apply();
  },
});

// register component
function register(element: HTMLElement) {
  const styleTraits = element
    .getAttributeNames()
    .filter((attr) => attr.startsWith("dx-style:"))
    .map((attr) => {
      const values = element.getAttribute(attr)?.split(" ");
      return values?.map((v) => {
        const [, prop] = attr.split(":");
        const [bpVal, bp] = v.split("@");
        const [val, psuedo] = bpVal.split(":");
        const _prop = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        return ["style", _prop, val, Number(bp ?? "0"), psuedo];
      });
    })
    .flat();
  html.el(element)(...(styleTraits as any));
}

function registerAll(container: Element) {
  const els = container.querySelectorAll(`[dx-style]`) as NodeListOf<HTMLElement>;
  els.forEach(register);
}

document.addEventListener("DOMContentLoaded", function () {
  registerAll(document.body);
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0 && mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) registerAll(node);
        });
      }
    });
  }).observe(document, { attributes: false, childList: true, subtree: true });
});
