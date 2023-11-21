type DomXtransformation = [selector: string, method: string, ...args: string[]];
type DomXdataSelector = [selector: string, property: string];
type DomXapiRequestor = [
  action: "GET" | "POST",
  url: string,
  ...dataSelections: DomXdataSelector[]
];

type DomXConfig = {
  events: {
    click: (DomXtransformation | DomXapiRequestor)[];
  };
};

class DomX {
  el: Element;
  config: DomXConfig;
  constructor(el: Element, config: DomXConfig) {
    this.el = el;
    this.config = config;
    this.parse = this.parse.bind(this);
    this.transform = this.transform.bind(this);
    this.parse();
  }
  parse() {
    const { events } = this.config;
    const eventNames = Object.keys(events);
    for (let i = 0; i < eventNames.length; i++) {
      const eventName = eventNames[i];
      this.el.addEventListener(eventName, (e) => {
        e.preventDefault();
        const event = events[eventName];
        for (let j = 0; j < event.length; j++) {
          const action = event[j];
          if (action[0] === "GET" || action[0] === "POST") {
            // this.apiRequest(action as DomXapiRequestor);
            console.log(action);
          } else {
            this.transform(action as DomXtransformation);
          }
        }
      });
    }
  }
  transform([selector, method, ...args]: DomXtransformation) {
    const el = document.querySelector(selector);
    console.log(selector);
    if (el) {
      (el as any)[method](...args);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const dxs = document.querySelectorAll("[dx]");
  for (let i = 0; i < dxs.length; i++) {
    const dx = dxs[i].getAttribute("dx") as string;
    fetch(dx)
      .then((response) => response.text())
      .then((config) => new DomX(dxs[i], JSON.parse(config)));
  }
});
