type DxEvent = [dx: "evt", evt: string];
type DxAppend = [dx: "append", selector: string, html: string];
type DxAttr = [dx: "attr", selector: string, attr: string, value: string];
type DxClick = [dx: "click", selector: string, evt: string];
type DxCall = [
  dx: "call",
  selector: string,
  method: string,
  ...args: (string | number)[]
];
type DxDispatch = [dx: "dispatch", evt: string, timeout?: number];
type DxGet = [dx: "get", url: string];
type DxHistory = [dx: "history", method: string, ...args: (string | number)[]];
type DxWin = [dx: "win", method: string, ...args: (string | number)[]];
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
type DxSubmit = [dx: "submit", selector: string, evt: string];
type DxText = [dx: "text", selector: string, text: string];
type DxWait = [dx: "wait", milliseconds: number, evt: string];

type DX =
  | DxAppend
  | DxAttr
  | DxClick
  | DxCall
  | DxDispatch
  | DxWin
  | DxGet
  | DxPost
  | DxReplace
  | DxServer
  | DxState
  | DxSubmit
  | DxText
  | DxWait;

type Config = {
  actions: Record<string, DX[]>;
  initialState: string;
  listeners: [selector: string, event: string, evt: string][];
  states: Record<string, Record<string | "entry", DX[]>>;
};

export class DomxState extends HTMLElement {
  state: string = "";
  config: Config = {
    actions: {},
    initialState: "",
    listeners: [],
    states: {},
  };
  subs: ((state: string, evt: string, dx: DX) => void)[] = [];
  timeouts: Record<string, NodeJS.Timeout> = {};
  constructor() {
    super();
    this.handleEvent = this.handleEvent.bind(this);
    this.applyAction = this.applyAction.bind(this);
    this.applyAppend = this.applyAppend.bind(this);
    this.applyAttr = this.applyAttr.bind(this);
    this.applyCall = this.applyCall.bind(this);
    this.applyEventListener = this.applyEventListener.bind(this);
    this.applyDispatch = this.applyDispatch.bind(this);
    this.applyGet = this.applyGet.bind(this);
    this.applyHistory = this.applyHistory.bind(this);
    this.applyWin = this.applyWin.bind(this);
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
    this.transform = this.transform.bind(this);
  }
  applyAction(transformation: DxEvent) {
    const [, action] = transformation;
    this.config.actions[action].forEach((t) => this.handleEvent(action, [t]));
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
    const [event, selector, evt] = transformation;
    const els = this.querySelectorAll(selector) as NodeListOf<HTMLElement>;
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      const cb = (e: any) => {
        e.preventDefault();
        this.handleClientEvent(evt);
      };
      el.removeEventListener(event, cb);
      el.addEventListener(event, cb);
    }
  }
  applyDispatch(transformation: DxDispatch) {
    const [, evt, timeout = 0] = transformation;
    clearTimeout(this.timeouts[evt]);
    this.timeouts[evt] = setTimeout(() => this.handleClientEvent(evt), timeout);
  }
  applyGet(transformation: DxGet) {
    const [, url] = transformation;
    fetch(url, {
      method: "GET",
    }).then((r) => r.json().then((d) => this.handleEvent("entry", d)));
  }
  applyHistory(transformation: DxHistory) {
    const [, method, ...args] = transformation;
    (<any>history)[method](...args);
  }
  applyWin(transformation: DxWin) {
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
    }).then((r) => r.json().then((d) => this.handleEvent("entry", d)));
  }
  applyReplace(transformation: DxReplace) {
    const [, selector, content] = transformation;
    const el = this.querySelector(selector);
    if (!el) return;
    el.innerHTML = "";
    el.innerHTML = decodeURIComponent(content);
  }
  applyState(transformation: DxState) {
    const [, state] = transformation;
    const hasEntry = this.config.states[state].entry;
    if (hasEntry) this.handleEvent("entry", this.config.states[state].entry);
    this.state = state;
  }
  applyText(transformation: DxText) {
    const [, selector, text] = transformation;
    const els = this.querySelectorAll(selector) as NodeListOf<HTMLElement>;
    els.forEach((el) => (el.textContent = text));
  }
  applyWait(transformation: DxWait) {
    const [, timeInSeconds, evt] = transformation;
    const startTime = new Date().getTime();
    while (new Date().getTime() - startTime < timeInSeconds) {
      // Do nothing
    }
    if (evt) this.handleClientEvent(evt);
  }
  connectedCallback() {
    const src = this.getAttribute("src");
    if (!src) return;
    fetch(src).then((r) => r.json().then(this.init));
  }
  /**
   * Dispatch an evt to the state machine manually
   * @param evt name of evt to dispatch
   */
  dispatch(evt: string) {
    this.handleClientEvent(evt);
  }
  /**
   * Handle a client event
   * @param evt name of evt to dispatch
   */
  handleClientEvent(evt: string) {
    this.handleEvent(evt, this.config.states[this.state][evt] as DX[]);
  }
  /**
   * Handle a server event
   * @param se server event
   */
  handleServerEvent(se: { evt: string } & any) {
    const { evt } = se;
    const transformations = this.config.states[this.state][evt].reduce(
      (acc, t) => [...acc, t],
      [] as DX[]
    );
    this.handleEvent(evt, transformations);
  }
  /**
   * Transform the state machine
   * @param evt name of application to run
   * @param transformations transformations to apply
   */
  handleEvent(evt: string, transformations: DX[]) {
    if (!transformations) return;
    for (let i = 0; i < transformations.length; i++) {
      const transformation = transformations[i];
      const [trait] = transformation;
      const traitMap = {
        action: this.applyAction,
        append: this.applyAppend,
        attr: this.applyAttr,
        call: this.applyCall,
        click: this.applyEventListener,
        dispatch: this.applyDispatch,
        get: this.applyGet,
        history: this.applyHistory,
        post: this.applyPost,
        replace: this.applyReplace,
        state: this.applyState,
        submit: this.applyEventListener,
        text: this.applyText,
        wait: this.applyWait,
        win: this.applyWin,
      };
      (traitMap as any)[trait](transformation);
      this.subs.forEach((s) => s(this.state, evt, transformation));
    }
  }
  init(config: Config) {
    this.config = config;

    // Apply listeners
    const listeners = this.config.listeners ?? [];

    const register = () => {
      for (let i = 0; i < listeners.length; i++) {
        const [selector, event, evt] = listeners[i];
        const selectorIfNotRegistered = `${selector}:not([data-dx-state="registered"])`;
        const els = this.querySelectorAll(
          selectorIfNotRegistered
        ) as NodeListOf<HTMLElement>;
        for (let j = 0; j < els.length; j++) {
          const el = els[j];
          const cb = (e: any) => {
            e.preventDefault();
            if (e.target !== el) return;
            this.handleClientEvent(evt);
          };
          el.addEventListener(event, cb);
          el.dataset.dxState = "registered";
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
    if (initState.entry) this.handleEvent("entry", initState.entry);
  }
  sub(s: (state: string, evt: string, dx: DX) => void) {
    this.subs.push(s);
  }
  transform(evt: string, transformations: DX[]) {
    this.handleEvent(evt, transformations);
  }
}

customElements.define("dx-state", DomxState);
