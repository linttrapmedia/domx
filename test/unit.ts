import { runner } from "./runner";
import * as domx from "./unit-tests/DOMX.test";

window.addEventListener("DOMContentLoaded", () => {
  runner([["DOMX", ["tests are working", domx.SmokeTest]]]);
});
