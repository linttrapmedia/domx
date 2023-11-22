type DxAppend = [dx: "append", selector: string, html: string];
type DxAttr = [dx: "attr", selector: string, attr: string, value: string];
type DxClick = [dx: "click", selector: string, event: string];
type DxCall = [
  dx: "call",
  selector: string,
  method: string,
  ...args: (string | number)[]
];
type DxJs = [dx: "js", method: string, ...args: (string | number)[]];
type DxPost = [
  dx: "post",
  url: string,
  ...data: [
    key: string,
    selector: string,
    val: "value" | "dataset" | "formData"
  ][]
];
type DxServer = [dx: "server"];
type DxState = [dx: "state", state: string];
type DxWait = [dx: "wait", milliseconds: number];

type DX =
  | DxAppend
  | DxAttr
  | DxClick
  | DxCall
  | DxJs
  | DxPost
  | DxServer
  | DxState
  | DxWait;

type Config = {
  initialState: string;
  states: Record<string, Record<string | "entry", DX[]>>;
};

class DomContext extends HTMLElement {
  state: string;
  config: Config;
  constructor() {
    super();
    this.init = this.init.bind(this);
    this.handleClientEvent = this.handleClientEvent.bind(this);
    this.transform = this.transform.bind(this);
    this.applyAppend = this.applyAppend.bind(this);
    this.applyAttr = this.applyAttr.bind(this);
    this.applyCall = this.applyCall.bind(this);
    this.applyClick = this.applyClick.bind(this);
    this.applyJs = this.applyJs.bind(this);
    this.applyPost = this.applyPost.bind(this);
    this.applyState = this.applyState.bind(this);
    this.applyWait = this.applyWait.bind(this);
    this.handleServerEvent = this.handleServerEvent.bind(this);
  }
  connectedCallback() {
    const src = this.getAttribute("src");
    if (!src) return;
    fetch(src).then((r) => r.json().then(this.init));
  }
  handleClientEvent(event: string) {
    this.transform(this.config.states[this.state][event] as DX[]);
  }
  handleServerEvent(se: { event: string; dx: DX[] }) {
    const { event, dx } = se;
    const transformations = this.config.states[this.state][event].reduce(
      (acc, t) => {
        if (t[0] === "server") return [...acc, ...dx];
        return [...acc, t];
      },
      [] as DX[]
    );
    this.transform(transformations);
  }
  init(config: Config) {
    this.config = config;
    const initState = config.states[config.initialState];
    if (initState.entry) this.transform(initState.entry);
  }
  transform(transformations: DX[]) {
    for (let i = 0; i < transformations.length; i++) {
      const transformation = transformations[i];
      const [trait] = transformation;
      switch (trait) {
        case "append":
          this.applyAppend(transformation);
          break;
        case "attr":
          this.applyAttr(transformation);
          break;
        case "click":
          this.applyClick(transformation);
          break;
        case "call":
          this.applyCall(transformation);
          break;
        case "js":
          this.applyJs(transformation);
          break;
        case "post":
          this.applyPost(transformation);
          break;
        case "state":
          this.applyState(transformation);
          break;
        case "wait":
          this.applyWait(transformation);
          break;
      }
    }
  }
  applyAppend(transformation: DxAppend) {
    const [, selector, html] = transformation;
    const el = this.querySelector(selector);
    if (!el) return;
    const tmpl = document.createElement("template");
    tmpl.innerHTML = decodeURIComponent(html);
    el.append(tmpl.content);
  }
  applyAttr(transformation: DxAttr) {
    const [, selector, attr, value] = transformation;
    const el = this.querySelector(selector);
    if (!el) return;
    if (value === null) return el.removeAttribute(attr);
    el.setAttribute(attr, value);
  }
  applyClick(transformation: DxClick) {
    const [, selector, event] = transformation;
    const el = this.querySelector(selector);
    if (!el) return;
    el?.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleClientEvent(event);
    });
  }
  applyCall(transformation: DxCall) {
    const [, selector, method, ...args] = transformation;
    const el = this.querySelector(selector);
    if (!el) return;
    el[method](...args);
  }
  applyJs(transformation: DxJs) {
    const [, method, ...args] = transformation;
    const m = eval(method);
    m(...args);
  }
  applyPost(transformation: DxPost) {
    const [, url, ...data] = transformation;
    const body = {};
    for (let i = 0; i < data.length; i++) {
      const [key, selector, val] = data[i];
      const el = this.querySelector(selector);
      if (!el) return;
      body[key] = el[val];
    }
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json().then(this.handleServerEvent));
  }
  applyState(transformation: DxState) {
    const [, state] = transformation;
    this.state = state;
  }
  applyWait(transformation: DxWait) {
    const [, timeInSeconds] = transformation;
    const startTime = new Date().getTime();
    while (new Date().getTime() - startTime < timeInSeconds) {
      // Do nothing
    }
  }
}

customElements.define("dom-context", DomContext);
