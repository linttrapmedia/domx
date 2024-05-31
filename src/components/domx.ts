type FSM = {
  initialState: string;
  listeners: [selector: string, event: string, evt: string][];
  states: Record<string, Record<string | "entry", string[][]>>;
};

function addClassTransformer(_: Domx, selector: string, className: string) {
  const els = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
  els.forEach((el) => el.classList.add(className));
}

function addEventListenerTransformer(domx: Domx, selector: string, event: string, fsmEvent: string) {
  const els = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
  els.forEach((el) => {
    const cb = (e: any) => {
      e.preventDefault();
      if (e.target !== el) return;
      domx.dispatch(fsmEvent);
    };
    el.removeEventListener(event, cb);
    el.addEventListener(event, cb);
  });
}

function appendTransformer(_: Domx, selector: string, html: string) {
  const el = document.querySelector(selector);
  if (!el) return;
  const tmpl = document.createElement("template");
  tmpl.innerHTML = decodeURIComponent(html);
  el.append(tmpl.content);
}

function dispatchTransformer(domx: Domx, event: string, timeout: number = 0) {
  clearTimeout(domx.timeouts[event]);
  domx.timeouts[event] = setTimeout(() => domx.dispatch(event), timeout);
}

function historyTransformer(_: Domx, state: string, title: string, url: string) {
  window.history.pushState(state, title, url);
}

function getRequestTransformer(domx: Domx, url: string) {
  fetch(url, {
    method: "GET",
  }).then((r) => r.json().then((transformations) => domx.transform(transformations)));
}

function innerHTMLTransformer(_: Domx, selector: string, html: string) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.innerHTML = decodeURIComponent(html);
}

function locationTransformer(_: Domx, url: string) {
  window.location.href = url;
}

function postRequestTransformer(domx: Domx, formSelector: string) {
  const form = document.querySelector(formSelector) as HTMLFormElement;
  const formData = new FormData(form);
  fetch(form.action, {
    body: formData,
    method: "POST",
  }).then((r) => r.json().then((transformations) => domx.transform(transformations)));
}

function textContentTransformer(_: Domx, selector: string, text: string) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.textContent = decodeURIComponent(text);
}

function removeAttributeTransformer(_: Domx, selector: string, attr: string) {
  const els = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
  els.forEach((el) => el.removeAttribute(attr));
}

function removeEventListenerTransformer(domx: Domx, selector: string, event: string, fsmEvent: string) {
  const els = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
  els.forEach((el) => {
    const cb = (e: any) => {
      e.preventDefault();
      if (e.target !== el) return;
      domx.dispatch(fsmEvent);
    };
    el.removeEventListener(event, cb);
  });
}

function removeClassTransformer(_: Domx, selector: string, className: string) {
  const els = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
  els.forEach((el) => el.classList.remove(className));
}

function replaceTransformer(_: Domx, selector: string, html: string) {
  const el = document.querySelector(selector);
  if (!el) return;
  const tmpl = document.createElement("template");
  tmpl.innerHTML = decodeURIComponent(html);
  el.replaceWith(tmpl.content);
}

function setAttributeTransformer(_: Domx, selector: string, attr: string, value: string) {
  const els = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
  els.forEach((el) => {
    if (value === null) return el.removeAttribute(attr);
    el.setAttribute(attr, value);
  });
}

function waitTransformer(_: Domx, timeout: number) {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < timeout) {
    // Do nothing
  }
}

function windowTransformer(_: Domx, method: string, ...args: any) {
  (window as any)[method](...args);
}

function stateTransformer(domx: Domx, state: string) {
  domx.state = state;
  if (domx.fsm.states[state].entry) domx.dispatch("entry");
}

export class Domx extends HTMLElement {
  state: string = "";
  fsm: FSM = {
    initialState: "",
    listeners: [],
    states: {},
  };
  subs: ((evt: string, prevState: string, nextState: string) => void)[] = [];
  timeouts: Record<string, NodeJS.Timeout> = {};
  tranformers: Record<string, (instance: Domx, ...args: any) => void> = {};
  /**
   * dynamically add a transformer
   * @param name name of transformer
   * @param cb callback
   */
  addTransformer(name: string, cb: (...args: any) => void) {
    this.tranformers[name] = cb;
    return this;
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `:host { display: none; }`;
    shadow.appendChild(style);
    this.dispatch = this.dispatch.bind(this);
    this.init = this.init.bind(this);
    this.sub = this.sub.bind(this);
    this.transform = this.transform.bind(this);

    // ==============================
    // Built-in transformers
    // ==============================

    this.addTransformer("addClass", addClassTransformer);
    this.addTransformer("addEventListener", addEventListenerTransformer);
    this.addTransformer("append", appendTransformer);
    this.addTransformer("dispatch", dispatchTransformer);
    this.addTransformer("innerHTML", innerHTMLTransformer);
    this.addTransformer("history", historyTransformer);
    this.addTransformer("get", getRequestTransformer);
    this.addTransformer("location", locationTransformer);
    this.addTransformer("post", postRequestTransformer);
    this.addTransformer("removeAttribute", removeAttributeTransformer);
    this.addTransformer("removeClass", removeClassTransformer);
    this.addTransformer("removeEventListener", removeEventListenerTransformer);
    this.addTransformer("replace", replaceTransformer);
    this.addTransformer("setAttribute", setAttributeTransformer);
    this.addTransformer("state", stateTransformer);
    this.addTransformer("textContent", textContentTransformer);
    this.addTransformer("wait", waitTransformer);
    this.addTransformer("window", windowTransformer);
  }

  connectedCallback() {
    const remote = this.getAttribute("src");
    if (remote) return fetch(remote).then((r) => r.json().then(this.init));
    const local: any = this.textContent;
    if (local) return this.init(JSON.parse(local));
    return;
  }
  /**
   * trigger an event
   * @param evt name of event
   */
  dispatch(evt: string) {
    const transformations = this.fsm.states[this.state][evt];
    if (!transformations) return;
    const prevState = this.state;
    // run transformations
    this.transform(transformations, () => {
      this.subs.forEach((s) => s(evt, prevState, this.state));
    });
  }
  /**
   * initialize the state machine
   * @param fsm state machine
   */
  init(fsm: FSM) {
    this.fsm = fsm;
    const listeners = this.fsm.listeners ?? [];

    // register event listeners
    const register = () => {
      for (let i = 0; i < listeners.length; i++) {
        const [selector, eventListener, fsmEvent] = listeners[i];
        const els = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
        // add event listeners to all registered elements
        for (let j = 0; j < els.length; j++) {
          const el = els[j];
          const cb = (e: any) => {
            e.preventDefault();
            if (e.target !== el) return;
            // event listeners can only do one thing, dispatch an event
            // all other transformations should be done in the state machine
            this.dispatch(fsmEvent);
          };
          // prevent duplicate event listeners
          el.removeEventListener(eventListener, cb);
          el.addEventListener(eventListener, cb);
        }
      }
    };
    // register event listeners for new elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes) register();
      });
    });

    // observe changes in the DOM
    observer.observe(this, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    register();

    // Apply initial state
    const initState = fsm.states[fsm.initialState];
    this.state = fsm.initialState;

    // run entry transformation if it exists
    if (initState.entry) this.dispatch("entry");
  }
  /**
   * subscribe to state changes
   * @param s callback
   * @returns
   */
  sub(s: (event: string, prevState: string, nextState: string) => void) {
    this.subs.push(s);
    return () => this.unsub(s);
  }
  /**
   * run list of transformations
   * @param tx transformation list
   * @param cb callback
   * @returns
   */
  transform(transformations: string[][] = [], cb?: () => void) {
    // get transformations from current state
    if (!transformations) return;

    // apply each transformation
    for (let i = 0; i < transformations.length; i++) {
      const transformation = transformations[i];
      const [transformer, ...transformerArgs] = transformation;
      const transformerFn = this.tranformers[transformer];
      if (!transformerFn) throw new Error(`Unknown transformer: ${transformer}`);
      transformerFn(this, ...transformerArgs);
    }

    if (cb) cb();
  }
  /**
   * unsubscribe from state changes
   * @param s callback
   */
  unsub: (s: (state: string, evt: string, transformations: any) => void) => void = (s) => {
    this.subs = this.subs.filter((sub) => sub !== s);
  };
}

customElements.define("dom-x", Domx);
