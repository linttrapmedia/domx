import { CanRenderText } from "../src/components/dx-text.test";
import { runner } from "./runner";

window.addEventListener("DOMContentLoaded", () => {
  runner([["HTML", ["can render dx-text", CanRenderText]], ["SVG"], ["State"]]);
});
