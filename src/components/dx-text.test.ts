import { Test } from "../types";
import "./dx-text";
import { DomxText } from "./dx-text";

// polyfillStyleSheet(DomxText);

export const CanRenderText: Test = (sandbox) => {
  const el = document.createElement("dx-text") as DomxText;
  el.setAttribute("font-size", "13px");
  el.innerHTML = "<div>test</div>";
  sandbox!.appendChild(el);
  el.render();
  const html = `<dx-text font-size="13px"><div>test</div></dx-text>`;
  const t1 = el.outerHTML === html;
  const computedStyle = getComputedStyle(el);
  console.log("styles read", el.styleSheet.textContent);
  return { pass: t1 };
};
