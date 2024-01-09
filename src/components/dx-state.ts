type DxAction = [dx: "action", action: string];
type DxAppend = [dx: "append", selector: string, html: string];
type DxAttr = [dx: "attr", selector: string, attr: string, value: string];
type DxClick = [dx: "click", selector: string, action: string];
type DxCall = [
  dx: "call",
  selector: string,
  method: string,
  ...args: (string | number)[]
];
type DxDispatch = [dx: "dispatch", action: string, timeout?: number];
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
type DxSubmit = [dx: "submit", selector: string, action: string];
type DxText = [dx: "text", selector: string, text: string];
type DxWait = [dx: "wait", milliseconds: number, action: string];

type DX =
  | DxAppend
  | DxAttr
  | DxClick
  | DxCall
  | DxDispatch
  | DxJs
  | DxGet
  | DxPost
  | DxReplace
  | DxServer
  | DxState
  | DxSubmit
  | DxWait;

type Config = {
  actions: Record<string, DX[]>;
  initialState: string;
  listeners: [selector: string, event: string, action: string][];
  states: Record<string, Record<string | "entry", DX[]>>;
};

export class DomState extends HTMLElement {
  state: string = "";
  config: Config = {
    actions: {},
    initialState: "",
    listeners: [],
    states: {},
  };
  subs: ((state: string, action: string, dx: DX) => void)[] = [];
  timeouts: Record<string, NodeJS.Timeout> = {};
  constructor() {
    super();
    this.transform = this.transform.bind(this);
    this.applyAction = this.applyAction.bind(this);
    this.applyAppend = this.applyAppend.bind(this);
    this.applyAttr = this.applyAttr.bind(this);
    this.applyCall = this.applyCall.bind(this);
    this.applyEventListener = this.applyEventListener.bind(this);
    this.applyDispatch = this.applyDispatch.bind(this);
    this.applyGet = this.applyGet.bind(this);
    this.applyJs = this.applyJs.bind(this);
    this.applyPost = this.applyPost.bind(this);
    this.applyReplace = this.applyReplace.bind(this);
    this.applyState = this.applyState.bind(this);
    this.applyText = this.applyText.bind(this);
    this.applyWait = this.applyWait.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.handleClientEvent = this.handleClientEvent.bind(this);
    this.handleServerEvent = this.handleServerEvent.bind(this);
    this.init = this.init.bind(this);
    this.sub = this.sub.bind(this);
  }
  applyAction(transformation: DxAction) {
    const [, action] = transformation;
    this.config.actions[action].forEach((t) => this.transform(action, [t]));
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
    const els = this.querySelectorAll(selector) as NodeListOf<HTMLElement>;
    els.forEach((el) => {
      if (value === null) return el.removeAttribute(attr);
      el.setAttribute(attr, value);
    });
  }
  applyCall(transformation: DxCall) {
    const [, selector, method, ...args] = transformation;
    const el: any = this.querySelector(selector);
    if (!el) return;
    el[method](...args);
  }
  applyEventListener(transformation: DxClick) {
    const [event, selector, action] = transformation;
    const els = this.querySelectorAll(selector) as NodeListOf<HTMLElement>;
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      const cb = (e: any) => {
        e.preventDefault();
        this.handleClientEvent(action);
      };
      el.removeEventListener(event, cb);
      el.addEventListener(event, cb);
    }
  }
  applyDispatch(transformation: DxDispatch) {
    const [, action, timeout = 0] = transformation;
    clearTimeout(this.timeouts[action]);
    this.timeouts[action] = setTimeout(
      () => this.handleClientEvent(action),
      timeout
    );
  }
  applyGet(transformation: DxGet) {
    const [, url] = transformation;
    fetch(url, {
      method: "GET",
    }).then((r) => r.json().then((d) => this.transform("entry", d)));
  }
  applyJs(transformation: DxJs) {
    const [, method, ...args] = transformation;
    (<any>window)[method](...args);
  }
  applyPost(transformation: DxPost) {
    const [, url, ...data] = transformation;
    const body: any = {};
    for (let i = 0; i < data.length; i++) {
      const [key, selector, val] = data[i];
      const el: any = this.querySelector(selector);
      if (!el) return;
      body[key] = el[val];
    }
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json().then((d) => this.transform("entry", d)));
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
    const hasEntry = this.config.states[state].entry;
    if (hasEntry) this.transform("entry", this.config.states[state].entry);
    this.state = state;
  }
  applyText(transformation: DxText) {
    const [, selector, text] = transformation;
    const els = this.querySelectorAll(selector) as NodeListOf<HTMLElement>;
    els.forEach((el) => (el.textContent = text));
  }
  applyWait(transformation: DxWait) {
    const [, timeInSeconds, action] = transformation;
    const startTime = new Date().getTime();
    while (new Date().getTime() - startTime < timeInSeconds) {
      // Do nothing
    }
    if (action) this.handleClientEvent(action);
  }
  connectedCallback() {
    const src = this.getAttribute("src");
    if (!src) return;
    fetch(src).then((r) => r.json().then(this.init));
  }
  /**
   * Dispatch an action to the state machine manually
   * @param action name of action to dispatch
   */
  dispatch(action: string) {
    this.handleClientEvent(action);
  }
  /**
   * Handle a client event
   * @param action name of action to dispatch
   */
  handleClientEvent(action: string) {
    this.transform(action, this.config.states[this.state][action] as DX[]);
  }
  /**
   * Handle a server event
   * @param se server event
   */
  handleServerEvent(se: { action: string } & any) {
    const { action } = se;
    const transformations = this.config.states[this.state][action].reduce(
      (acc, t) => [...acc, t],
      [] as DX[]
    );
    this.transform(action, transformations);
  }
  init(config: Config) {
    this.config = config;
    const that = this;

    // Apply listeners
    const listeners = this.config.listeners ?? [];

    const register = () => {
      for (let i = 0; i < listeners.length; i++) {
        const [selector, event, action] = listeners[i];
        const els = this.querySelectorAll(selector) as NodeListOf<HTMLElement>;
        for (let j = 0; j < els.length; j++) {
          const el = els[j];
          const cb = (e: any) => {
            e.preventDefault();
            if (e.target !== el) return;
            this.handleClientEvent(action);
          };
          that.removeEventListener(event, cb);
          that.addEventListener(event, cb);
        }
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes) register();
      });
    });

    observer.observe(this, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    register();

    // Apply initial state
    const initState = config.states[config.initialState];
    this.state = config.initialState;
    if (initState.entry) this.transform("entry", initState.entry);
  }
  sub(s: (state: string, action: string, dx: DX) => void) {
    this.subs.push(s);
  }
  transform(action: string, transformations: DX[]) {
    if (!transformations) return;
    for (let i = 0; i < transformations.length; i++) {
      const transformation = transformations[i];
      const [trait] = transformation;
      const traitMap = {
        action: this.applyAction,
        append: this.applyAppend,
        attr: this.applyAttr,
        click: this.applyEventListener,
        call: this.applyCall,
        dispatch: this.applyDispatch,
        js: this.applyJs,
        get: this.applyGet,
        post: this.applyPost,
        replace: this.applyReplace,
        state: this.applyState,
        submit: this.applyEventListener,
        text: this.applyText,
        wait: this.applyWait,
      };
      (traitMap as any)[trait](transformation);
      this.subs.forEach((s) => s(this.state, action, transformation));
    }
  }
}

customElements.define("dx-state", DomState);
