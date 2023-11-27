type DxAppend = [dx: "append", selector: string, html: string];
type DxAttr = [dx: "attr", selector: string, attr: string, value: string];
type DxClick = [dx: "click", selector: string, event: string];
type DxCall = [
  dx: "call",
  selector: string,
  method: string,
  ...args: (string | number)[]
];
type DxGet = [dx: "get", url: string];
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
type DxReplace = [dx: "replace", selector: string, content: string];
type DxServer = [dx: "server", key: string];
type DxState = [dx: "state", state: string];
type DxWait = [dx: "wait", milliseconds: number];

type DX =
  | DxAppend
  | DxAttr
  | DxClick
  | DxCall
  | DxJs
  | DxGet
  | DxPost
  | DxReplace
  | DxServer
  | DxState
  | DxWait;

type Config = {
  initialState: string;
  states: Record<string, Record<string | "entry", DX[]>>;
};

class DomMachine extends HTMLElement {
  state: string;
  config: Config;
  subs: ((state: string, event: string, dx: DX) => void)[] = [];
  constructor() {
    super();
    this.autoBind = this.autoBind.bind(this);
    this.transform = this.transform.bind(this);
    this.applyAppend = this.applyAppend.bind(this);
    this.applyAttr = this.applyAttr.bind(this);
    this.applyCall = this.applyCall.bind(this);
    this.applyClick = this.applyClick.bind(this);
    this.applyGet = this.applyGet.bind(this);
    this.applyJs = this.applyJs.bind(this);
    this.applyPost = this.applyPost.bind(this);
    this.applyReplace = this.applyReplace.bind(this);
    this.applyState = this.applyState.bind(this);
    this.applyWait = this.applyWait.bind(this);
    this.handleClientEvent = this.handleClientEvent.bind(this);
    this.handleServerEvent = this.handleServerEvent.bind(this);
    this.init = this.init.bind(this);
    this.sub = this.sub.bind(this);
  }
  connectedCallback() {
    const src = this.getAttribute("src");
    if (!src) return;
    fetch(src).then((r) => r.json().then(this.init));
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
  applyGet(transformation: DxGet) {
    const [, url] = transformation;
    fetch(url, {
      method: "GET",
    }).then((r) => r.json().then(this.handleServerEvent));
  }
  applyJs(transformation: DxJs) {
    const [, method, ...args] = transformation;
    window[method](...args);
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
  applyReplace(transformation: DxReplace) {
    const [, selector, content] = transformation;
    const el = this.querySelector(selector);
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const tmpl = document.createElement("template");
    tmpl.innerHTML = decodeURIComponent(content);
    parent.replaceChild(tmpl.content, el);
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
  autoBind() {
    const bindMap = [["click", this.querySelectorAll("[dx\\:click]")]];
    for (let i = 0; i < bindMap.length; i++) {
      const [event, els] = bindMap[i] as [string, NodeListOf<HTMLElement>];
      for (let j = 0; j < els.length; j++) {
        const el = els[j] as HTMLElement;
        const dx = el.getAttribute(`dx:${event}`);
        if (!dx) continue;
        el.addEventListener(event, (e) => {
          e.preventDefault();
          this.handleClientEvent(dx);
        });
      }
    }
  }
  handleClientEvent(event: string) {
    this.transform(event, this.config.states[this.state][event] as DX[]);
  }
  handleServerEvent(se: { event: string } & any) {
    const { event } = se;
    const transformations = this.config.states[this.state][event].reduce(
      (acc, t) => {
        const [dx, key] = t as any;
        if (dx === "server") return [...acc, ...se[key]];
        return [...acc, t];
      },
      [] as DX[]
    );
    this.transform(event, transformations);
  }
  init(config: Config) {
    this.config = config;
    const initState = config.states[config.initialState];
    this.state = config.initialState;
    if (initState.entry) this.transform("entry", initState.entry);
    this.autoBind();
  }
  sub(s: (state: string, action: string, dx: DX) => void) {
    this.subs.push(s);
  }
  transform(event: string, transformations: DX[]) {
    for (let i = 0; i < transformations.length; i++) {
      const transformation = transformations[i];
      const [trait] = transformation;
      const traitMap = {
        append: this.applyAppend,
        attr: this.applyAttr,
        click: this.applyClick,
        call: this.applyCall,
        js: this.applyJs,
        get: this.applyGet,
        post: this.applyPost,
        replace: this.applyReplace,
        state: this.applyState,
        wait: this.applyWait,
      };
      traitMap[trait](transformation);
      this.subs.forEach((s) => s(this.state, event, transformation));
    }
  }
}

customElements.define("dom-machine", DomMachine);
