import { runner } from "./runner";
import * as tests from "./unit-tests/DOMX.test";

window.addEventListener("DOMContentLoaded", async () => {
  await runner([
    tests.SmokeTest,
    tests.AddTransformerTest,
    tests.AppendTest,
    tests.AttrTest,
    tests.AddEventListenerTest,
    tests.DispatchTest,
    tests.GetRequestTest,
    tests.HistoryTest,
    tests.PostRequestTest,
    tests.RemoveAttributeTest,
    tests.RemoveClassTest,
    tests.RemoveEventListener,
    tests.ReplaceTest,
    tests.SetAttributeTest,
    tests.StateTest,
  ]);
});
