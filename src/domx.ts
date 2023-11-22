type TransformAppend = [domx: "append", selector: string, html: string];
type TransformAttr = [
  domx: "attr",
  selector: string,
  attr: string,
  value: string
];
type TransformClick = [domx: "click", selector: string, event: string];
type TransformMethod = [domx: "method", selector: string, method: string];
type TransformWait = [domx: "wait", timeInSeconds: number];
type TransformPost = [
  domx: "post",
  url: string,
  ...data: [
    key: string,
    selector: string,
    val: "value" | "dataset" | "formData"
  ][]
];
type TransformState = [domx: "state", state: string];

type Transformations =
  | TransformAppend
  | TransformAttr
  | TransformClick
  | TransformMethod
  | TransformPost
  | TransformState
  | TransformWait;

type Config = {
  initialState: string;
  states: Record<
    string,
    Record<string | "entry", Transformations[] | "server">
  >;
};

class Domx extends HTMLElement {
  state: string;
  config: Config;
  constructor() {
    super();
    this.init = this.init.bind(this);
    this.handleClientEvent = this.handleClientEvent.bind(this);
    this.transform = this.transform.bind(this);
    this.applyClick = this.applyClick.bind(this);
    this.applyState = this.applyState.bind(this);
    this.applyAppend = this.applyAppend.bind(this);
    this.applyMethod = this.applyMethod.bind(this);
    this.applyAttr = this.applyAttr.bind(this);
    this.applyPost = this.applyPost.bind(this);
    this.applyWait = this.applyWait.bind(this);
    this.handleServerEvent = this.handleServerEvent.bind(this);
  }
  connectedCallback() {
    const src = this.getAttribute("src");
    if (!src) return;
    fetch(src).then((r) => r.json().then(this.init));
  }
  handleClientEvent(event: string) {
    if (this.config.states[this.state][event] === "server") return;
    this.transform(this.config.states[this.state][event] as Transformations[]);
  }
  handleServerEvent(se: { event: string; dx: Transformations[] }) {
    const { event, dx } = se;
    const isServerEvent = this.config.states[this.state][event] === "server";
    if (!isServerEvent) return;
    this.transform(dx);
  }
  init(config: Config) {
    this.config = config;
    const initState = config.states[config.initialState];
    if (initState.entry === "server") return;
    if (initState.entry) this.transform(initState.entry);
  }
  transform(transformations: Transformations[]) {
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
        case "method":
          this.applyMethod(transformation);
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
  applyAppend(transformation: TransformAppend) {
    const [, selector, html] = transformation;
    const el = document.querySelector(selector);
    console.log(el, selector);
    if (!el) return;
    const tmpl = document.createElement("template");
    tmpl.innerHTML = decodeURIComponent(html);
    el.append(tmpl.content);
  }
  applyAttr(transformation: TransformAttr) {
    const [, selector, attr, value] = transformation;
    const el = document.querySelector(selector);
    if (!el) return;
    if (value === null) return el.removeAttribute(attr);
    el.setAttribute(attr, value);
  }
  applyClick(transformation: TransformClick) {
    const [, selector, event] = transformation;
    const el = document.querySelector(selector);
    if (!el) return;
    el?.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleClientEvent(event);
    });
  }
  applyMethod(transformation: TransformMethod) {
    const [, selector, method] = transformation;
    const el = document.querySelector(selector);
    if (!el) return;
    el[method]();
  }
  applyPost(transformation: TransformPost) {
    const [, url, ...data] = transformation;

    const body = {};
    for (let i = 0; i < data.length; i++) {
      const [key, selector, val] = data[i];
      const el = document.querySelector(selector);
      if (!el) return;
      body[key] = el[val];
    }

    console.log(body);

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json().then(this.handleServerEvent));
  }
  applyState(transformation: TransformState) {
    const [, state] = transformation;
    this.state = state;
  }
  applyWait(transformation: TransformWait) {
    const [, timeInSeconds] = transformation;
    const startTime = new Date().getTime();
    while (new Date().getTime() - startTime < timeInSeconds) {
      // Do nothing
    }
  }
}

customElements.define("dom-x", Domx);
