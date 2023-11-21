// type DomXtransformation = [selector: string, method: string, ...args: string[]];
// type DomXdataSelector = [selector: string, property: string];
// type DomXapiRequestor = [
//   action: "GET" | "POST",
//   url: string,
//   ...dataSelections: DomXdataSelector[]
// ];

// type DomXConfig = {
//   events: {
//     click: (DomXtransformation | DomXapiRequestor)[];
//   };
// };

// class DomX {
//   el: Element;
//   config: DomXConfig;
//   constructor(el: Element, config: DomXConfig) {
//     this.el = el;
//     this.config = config;
//     this.transform = this.transform.bind(this);
//     this.parse.bind(this)();
//   }
//   parse() {
//     const { events } = this.config;
//     const eventNames = Object.keys(events);
//     for (let i = 0; i < eventNames.length; i++) {
//       const eventName = eventNames[i];
//       this.el.addEventListener(eventName, (e) => {
//         e.preventDefault();
//         const event = events[eventName];
//         for (let j = 0; j < event.length; j++) {
//           const action = event[j];
//           if (action[0] === "GET" || action[0] === "POST") {
//             // this.apiRequest(action as DomXapiRequestor);
//             console.log(action);
//           } else {
//             this.transform(action as DomXtransformation);
//           }
//         }
//       });
//     }
//   }
//   transform([selector, method, ...args]: DomXtransformation) {
//     const el = document.querySelector(selector);
//     console.log(selector);
//     if (el) {
//       (el as any)[method](...args);
//     }
//   }
// }

type DomxClickTransformation = [domx: "click", selector: string, event: string];
type DomxTransformations = DomxClickTransformation;
type DomxState = Record<string | "entry", DomxTransformations[]>;

type DomxConfig = {
  initialState: string;
  states: Record<string, Record<string | "entry", DomxTransformations[]>>;
};
class Domx extends HTMLElement {
  config: DomxConfig;
  constructor() {
    super();
    this.init = this.init.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.transform = this.transform.bind(this);
    this.transformClick = this.transformClick.bind(this);
  }
  connectedCallback() {
    const src = this.getAttribute("src");
    if (!src) return;
    fetch(src).then((r) => r.json().then(this.init));
  }
  handleEvent(event: string) {
    console.log(event);
  }
  init(config: DomxConfig) {
    this.config = config;
    const initState = config.states[config.initialState];
    if (initState.entry) this.transform(initState.entry);
  }
  transform(transformations: DomxState["transformations"]) {
    for (let i = 0; i < transformations.length; i++) {
      const [trait] = transformations[i];
      switch (trait) {
        case "click":
          this.transformClick(transformations[i]);
          break;
      }
    }
  }
  transformClick(transformation: DomxClickTransformation) {
    const [, selector, event] = transformation;
    const el = document.querySelector(selector);
    console.log(selector, el, event);
  }
}

customElements.define("dom-x", Domx);
