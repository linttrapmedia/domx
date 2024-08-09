import { Test } from "../../src/types";

export const SmokeTest: Test = () => {
  const div = document.createElement("div");
  div.outerHTML = "<div></div>";
  const t1 = div.outerHTML === "<div></div>";
  return { pass: t1 };
};
