import { runner } from "./runner";
import { AddEventListenerTest, AppendTest, AttrTest, SmokeTest } from "./unit-tests/DOMX.test";

window.addEventListener("DOMContentLoaded", async () => {
  await runner([SmokeTest, AppendTest, AttrTest, AddEventListenerTest]);
});
