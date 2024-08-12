import { Domx, GetRequestTransformer } from "../../src/domx";
import { Test } from "../../src/types";

const getUniqueElId = () => `el${Math.random().toString(36).substring(7)}`;

export const AddTransformerTest: Test = (callback) => {
  let submitted = false;
  function MockSubmitTransformer() {
    submitted = true;
  }

  const uuid = getUniqueElId();

  const fsm = new Domx({
    id: "fsm",
    initialState: "TEST",
    states: {
      TEST: {
        submit: [["submit", `#${uuid}`]],
      },
    },
  });
  fsm.addTransformer("submit", MockSubmitTransformer);
  fsm.dispatch("submit");
  fsm.sub((evt, prevState, nextState) => {
    if (evt === "submit" && submitted) callback({ label: "Submit", pass: true, message: "can submit form" });
  });
};

export const AppendTest: Test = (callback) => {
  const sandbox = document.querySelector("#test-sandbox") as HTMLElement;
  const uuid = getUniqueElId();
  const el = document.createElement("div");
  el.id = uuid;
  sandbox.appendChild(el);
  new Domx({
    id: "fsm",
    initialState: "TEST",
    states: {
      TEST: {
        test: [["append", `#${uuid}`, "<span>test</span>"]],
      },
    },
  }).dispatch("test");
  const t1 = sandbox.querySelector(`#${uuid}`)?.outerHTML === `<div id="${uuid}"><span>test</span></div>`;
  callback({ label: "Append", pass: t1, message: "can append element" });
};

export const AttrTest: Test = (callback) => {
  const sandbox = document.querySelector("#test-sandbox") as HTMLElement;
  const uuid = getUniqueElId();
  const el = document.createElement("div");
  el.id = uuid;
  sandbox.appendChild(el);
  new Domx({
    id: "fsm",
    initialState: "TEST",
    states: {
      TEST: {
        test: [["setAttribute", `#${uuid}`, "data-test", "test"]],
      },
    },
  }).dispatch("test");
  const t1 = document.getElementById(uuid)?.outerHTML === `<div id="${uuid}" data-test="test"></div>`;
  callback({ label: "Attr", pass: t1, message: "can set attribute" });
};

export const AddEventListenerTest: Test = (callback) => {
  const sandbox = document.querySelector("#test-sandbox") as HTMLElement;
  const el1uuid = getUniqueElId();
  const el1 = document.createElement("button");
  el1.id = el1uuid;
  sandbox.appendChild(el1);
  const fsm = new Domx({
    id: "fsm",
    initialState: "TEST",
    listeners: [[`#${el1uuid}`, "click", "t1"]],
    states: {
      TEST: {
        t1: [["state", "CLICKED"]],
      },
      CLICKED: {},
    },
  });
  el1.click();
  fsm.sub((evt, prevState, nextState) => {
    if (nextState === "CLICKED") callback({ label: "AddEventListener", pass: true, message: "can add event listener" });
  });
};

export const DispatchTest: Test = (callback) => {
  const fsm = new Domx({
    id: "fsm",
    initialState: "TEST",
    states: {
      TEST: {
        entry: [["dispatch", "test"]],
        test: [["state", "DISPATCHED"]],
      },
      DISPATCHED: {},
    },
  });
  fsm.sub((evt, prevState, nextState) => {
    if (nextState === "DISPATCHED") callback({ label: "Dispatch", pass: true, message: "can dispatch event" });
  });
};

export const GetRequestTest: Test = (callback) => {
  const sandbox = document.querySelector("#test-sandbox") as HTMLElement;
  const uuid = getUniqueElId();
  const el = document.createElement("input");
  el.id = uuid;
  el.value = "test";
  sandbox.appendChild(el);

  let formValue = "";
  async function mockGetRequestTransformer(domx: Domx, url: string, data: GetRequestTransformer[]) {
    formValue = (sandbox.querySelector(data[0][1]) as any).value ?? "";
    domx.transform([["state", "TESTED"]]);
  }

  const fsm = new Domx({
    id: "fsm",
    initialState: "TEST",
    states: {
      TEST: {
        test: [["get", "/test", [["data", `#${uuid}`, "value"]]]],
      },
      TESTED: {},
    },
  });
  fsm.addTransformer("get", mockGetRequestTransformer);
  fsm.dispatch("test");
  fsm.sub((evt, prevState, nextState) => {
    if (nextState === "TESTED" && formValue === "test")
      callback({ label: "Get", pass: true, message: "can fetch a url" });
  });
};

export const HistoryTest: Test = (callback) => {
  window.history.pushState = function (title, url) {
    if (title === "TEST" && url === "/test") callback({ label: "History", pass: true, message: "can set history" });
  };
  new Domx({
    id: "fsm",
    initialState: "TEST",
    states: {
      TEST: {
        entry: [["history", "pushState", "TEST", "/test"]],
      },
    },
  });
};

export const PostRequestTest: Test = (callback) => {
  const sandbox = document.querySelector("#test-sandbox") as HTMLElement;
  const uuid = getUniqueElId();
  const el = document.createElement("input");
  el.id = uuid;
  el.value = "test";
  sandbox.appendChild(el);

  let formValue = "";
  async function mockPostRequestTransformer(domx: Domx, url: string, data: GetRequestTransformer[]) {
    formValue = (sandbox.querySelector(data[0][1]) as any).value ?? "";
    domx.transform([["state", "TESTED"]]);
  }

  const fsm = new Domx({
    id: "fsm",
    initialState: "TEST",
    states: {
      TEST: {
        test: [["post", "/test", [["data", `#${uuid}`, "value"]]]],
      },
      TESTED: {},
    },
  });
  fsm.addTransformer("post", mockPostRequestTransformer);
  fsm.dispatch("test");
  fsm.sub((evt, prevState, nextState) => {
    if (nextState === "TESTED" && formValue === "test")
      callback({ label: "Post", pass: true, message: "can post a form" });
  });
};

export const RemoveAttributeTest: Test = (callback) => {
  const sandbox = document.querySelector("#test-sandbox") as HTMLElement;
  const uuid = getUniqueElId();
  const el = document.createElement("div");
  el.id = uuid;
  el.setAttribute("data-test", "test");
  sandbox.appendChild(el);
  new Domx({
    id: "fsm",
    initialState: "TEST",
    states: {
      TEST: {
        test: [["removeAttribute", `#${uuid}`, "data-test"]],
      },
    },
  }).dispatch("test");
  const t1 = document.getElementById(uuid)?.outerHTML === `<div id="${uuid}"></div>`;
  callback({ label: "RemoveAttribute", pass: t1, message: "can remove attribute" });
};

export const RemoveClassTest: Test = (callback) => {
  const sandbox = document.querySelector("#test-sandbox") as HTMLElement;
  const uuid = getUniqueElId();
  const el = document.createElement("div");
  el.id = uuid;
  el.classList.add("test");
  sandbox.appendChild(el);
  const fsm = new Domx({
    id: "fsm",
    initialState: "TEST",
    states: {
      TEST: {
        entry: [
          ["removeClass", `#${uuid}`, "test"],
          ["dispatch", "test"],
        ],
        test: [],
      },
    },
  });
  fsm.sub((evt) => {
    if (evt === "test" && !el.classList.contains("test"))
      callback({ label: "RemoveClass", pass: true, message: "can remove class" });
  });
};

export const RemoveEventListener: Test = (callback) => {
  const sandbox = document.querySelector("#test-sandbox") as HTMLElement;
  const uuid = getUniqueElId();
  const el = document.createElement("button");
  el.id = uuid;
  sandbox.appendChild(el);
  const fsm = new Domx({
    id: "fsm",
    initialState: "TEST",
    listeners: [[`#${uuid}`, "click", "t1"]],
    states: {
      TEST: {
        entry: [
          ["removeEventListener", `#${uuid}`, "click"],
          ["trigger", `#${uuid}`, "click"],
        ],
        t1: [["state", "UNREACHABLE"]],
      },
      UNREACHABLE: {},
    },
  });
  fsm.sub(() => {
    if (fsm.eventRegistry.length === 0)
      callback({ label: "RemoveEventListener", pass: true, message: "can remove event listener" });
  });
};

export const ReplaceTest: Test = (callback) => {
  const sandbox = document.querySelector("#test-sandbox") as HTMLElement;
  const uuid = getUniqueElId();
  const el = document.createElement("div");
  el.innerHTML = `<span id="replace-${uuid}">replace me</span>`;
  el.id = uuid;
  sandbox.appendChild(el);
  const fsm = new Domx({
    id: "fsm",
    initialState: "TEST",
    states: {
      TEST: {
        entry: [
          ["replace", `#replace-${uuid}`, `<span id="replaced-${uuid}">test</span>`],
          ["state", "REPLACED"],
        ],
      },
      REPLACED: {},
    },
  });
  fsm.sub((evt, prevState, nextState) => {
    if (nextState === "REPLACED" && sandbox.querySelector(`#replaced-${uuid}`)?.outerHTML)
      callback({ label: "Replace", pass: true, message: "can replace element" });
  });
};

export const SetAttributeTest: Test = (callback) => {
  const sandbox = document.querySelector("#test-sandbox") as HTMLElement;
  const uuid = getUniqueElId();
  const el = document.createElement("div");
  el.id = uuid;
  sandbox.appendChild(el);
  new Domx({
    id: "fsm",
    initialState: "TEST",
    states: {
      TEST: {
        test: [["setAttribute", `#${uuid}`, "data-test", "test"]],
      },
    },
  }).dispatch("test");
  const t1 = document.getElementById(uuid)?.outerHTML === `<div id="${uuid}" data-test="test"></div>`;
  callback({ label: "SetAttribute", pass: t1, message: "can set attribute" });
};

export const SmokeTest: Test = (callback) =>
  setTimeout(() => callback({ label: "Smoke", pass: true, message: "test suite is working" }), 0);

export const StateTest: Test = (callback) => {
  const fsm = new Domx({
    id: "fsm",
    initialState: "TEST",
    states: {
      TEST: {
        entry: [["state", "TESTED"]],
      },
      TESTED: {},
    },
  });
  fsm.sub((evt, prevState, nextState) => {
    if (nextState === "TESTED") callback({ label: "State", pass: true, message: "can change state" });
  });
};

// submit: skipped, tested in AddTransformerTest

export const TextContentTest: Test = (callback) => {
  const sandbox = document.querySelector("#test-sandbox") as HTMLElement;
  const uuid = getUniqueElId();
  const el = document.createElement("div");
  el.id = uuid;
  el.textContent = "test";
  sandbox.appendChild(el);
  new Domx({
    id: "fsm",
    initialState: "TEST",
    states: {
      TEST: {
        test: [["textContent", `#${uuid}`, "tested"]],
      },
    },
  }).dispatch("test");
  const t1 = document.getElementById(uuid)?.outerHTML === `<div id="${uuid}">tested</div>`;
  callback({ label: "TextContent", pass: t1, message: "can set textContent" });
};

export const WaitTest: Test = (callback) => {
  const start = Date.now();
  const fsm = new Domx({
    id: "fsm",
    initialState: "TEST",
    states: {
      TEST: {
        entry: [
          ["wait", 100],
          ["state", "TESTED"],
        ],
      },
      TESTED: {},
    },
  });
  fsm.sub((evt, prevState, nextState) => {
    if (nextState === "TESTED" && Date.now() - start > 100) {
      callback({ label: "Wait", pass: true, message: "can wait" });
    }
  });
};

export const WaitAsDebouncerTest: Test = (callback) => {
  const sandbox = document.querySelector("#test-sandbox") as HTMLElement;
  const uuid = getUniqueElId();
  const el = document.createElement("button");
  el.id = uuid;
  sandbox.appendChild(el);

  const start = Date.now();
  let eventCount = 0;

  function eventCounterTransformer() {
    eventCount++;
  }

  const fsm = new Domx({
    id: "fsm",
    initialState: "TEST",
    listeners: [[`#${uuid}`, "click", "test"]],
    states: {
      TEST: {
        // @ts-ignore
        test: [["wait", 100], ["count"]],
      },
      TESTED: {},
    },
  });

  fsm.addTransformer("count", eventCounterTransformer);
  el.click();
  el.click();
  el.click();

  fsm.sub((evt, prevState, nextState) => {
    if (eventCount === 1 && Date.now() - start > 100)
      callback({ label: "WaitAsDebouncer", pass: true, message: "wait can debounce events" });
  });
};

export const WindowMethodsTest: Test = (callback) => {
  const sandbox = document.querySelector("#test-sandbox") as HTMLElement;
  const uuid = getUniqueElId();
  const el = document.createElement("div");
  el.id = uuid;
  sandbox.appendChild(el);
  let alertCalled = false;
  window.alert = (message: string) => {
    if (message === "test") alertCalled = true;
  };
  const fsm = new Domx({
    id: "fsm",
    initialState: "TEST",
    states: {
      TEST: {
        entry: [["window", "alert", "test"]],
      },
    },
  });
  fsm.sub((evt, prevState, nextState) => {
    if (alertCalled) callback({ label: "WindowMethods", pass: true, message: "can call window methods" });
  });
};
