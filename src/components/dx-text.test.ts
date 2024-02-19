import { Test } from "../types";
import "./dx-text";
import { DomxText } from "./dx-text";

export const CanRenderText: Test = async () => {
  const el = document.createElement("dx-text") as DomxText;
  el.styleSheet = new CSSStyleSheet();
  el.styleSheet.replace = function (newStyles) {
    newStyles.split("}").forEach((rule) => {
      const trimmedRule = rule.trim();
      if (trimmedRule) {
        el.styleSheet.insertRule(trimmedRule + "}", this.cssRules.length);
      }
    });

    return null as any;
  };

  console.log('"======"', el.styleSheet.cssRules);
  el.setAttribute("font-size", "12px");
  el.innerHTML = "<div>test</div>";
  const t1 = el.outerHTML === "<dx-text><div>test</div></dx-text>";
  return { pass: t1 };
};
