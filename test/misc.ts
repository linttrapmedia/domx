import { Domx } from "../src/domx";

const domx = new Domx({
  id: "test",
  initialState: "init",
  listeners: [],
  states: {
    init: {
      entry: [["addClass", ".test", "asdf"]],
    },
  },
});
