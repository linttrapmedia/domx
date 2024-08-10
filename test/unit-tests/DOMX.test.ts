import { Domx } from "../../src/domx";
import { Test } from "../../src/types";

const getUniqueElId = () => `el${Math.random().toString(36).substring(7)}`;

export const SmokeTest: Test = {
  done: (callback) => setTimeout(() => callback({ label: "Smoke", pass: true, message: "test suite is working" }), 0),
};
export const AppendTest: Test = {
  done: (callback) => {
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
  },
};
export const AttrTest: Test = {
  done: (callback) => {
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
  },
};

export const AddEventListenerTest: Test = {
  done: (callback) => {
    const sandbox = document.querySelector("#test-sandbox") as HTMLElement;
    const el1uuid = getUniqueElId();
    const el1 = document.createElement("button");
    el1.id = el1uuid;
    sandbox.appendChild(el1);
    const el2uuid = getUniqueElId();
    const fsm = new Domx({
      id: "fsm",
      initialState: "TEST",
      listeners: [[`#${el1uuid}`, "click", "t1"]],
      states: {
        TEST: {
          t1: [["state", "CLICKED"]],
        },
        CLICKED: {
          entry: [
            ["append", "#test-sandbox", `<button id="${el2uuid}">dynamically added</button>`],
            ["addEventListener", `#${el2uuid}`, "click", "t2"],
            ["trigger", `#${el2uuid}`, "click"],
          ],
          t2: [["state", "CLICKED_AGAIN"]],
        },
        CLICKED_AGAIN: {},
      },
    });
    el1?.click();
    fsm.sub((evt, prevState, nextState) => {
      if (nextState === "CLICKED_AGAIN")
        callback({ label: "AddEventListener", pass: true, message: "can add event listener" });
    });
  },
};
