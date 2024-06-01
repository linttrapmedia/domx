import { Domx } from "../src/domx";

const domx = new Domx({
  initialState: "init",
  listeners: [],
  states: {
    init: {
      entry: [["addClass", ".test", "asdf"]],
    },
  },
});
