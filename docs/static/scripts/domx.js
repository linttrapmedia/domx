"use strict";
(() => {
  // src/domx.ts
  function getNodeListBySelector(selector) {
    if (selector.startsWith("#")) {
      const el = document.querySelector(selector);
      if (el) {
        return [el];
      } else {
        return document.querySelectorAll(selector);
      }
    } else {
      return document.querySelectorAll(selector);
    }
  }
  async function addClassTransformer(_, selector, className) {
    const els = getNodeListBySelector(selector);
    els.forEach((el) => el.classList.add(className));
  }
  async function addEventListenerTransformer(domx, selector, event, fsmEvent) {
    domx.removeEventListenersForSelector(selector, event);
    const cb = (e) => {
      e.preventDefault();
      domx.dispatch(fsmEvent);
    };
    domx.addEventListenerToElement(selector, event, cb);
  }
  async function appendTransformer(_, selector, html) {
    const el = document.querySelector(selector);
    if (!el)
      return;
    const tmpl = document.createElement("template");
    tmpl.innerHTML = decodeURIComponent(html);
    el.append(tmpl.content);
  }
  async function consoleTransformer(_, ...args) {
    console.log(...args);
  }
  async function dispatchTransformer(domx, event, timeout = 0) {
    clearTimeout(domx.timeouts[event]);
    domx.timeouts[event] = setTimeout(() => domx.dispatch(event), timeout);
  }
  async function historyTransformer(_, method, ...args) {
    window.history[method](...args);
  }
  async function getRequestTransformer(domx, url, data) {
    const run = () => {
      const urlSearchParams = new URLSearchParams();
      data.forEach(([key, selector, prop, propKey]) => {
        switch (prop) {
          case "attribute":
            const el1 = document.querySelector(selector);
            if (!el1)
              return;
            urlSearchParams.append(key, el1.getAttribute(propKey));
            break;
          case "dataset":
            const el2 = document.querySelector(selector);
            if (!el2)
              return;
            urlSearchParams.append(key, el2.dataset[prop][propKey]);
            break;
          case "value":
            const el = document.querySelector(selector);
            if (!el)
              return;
            urlSearchParams.append(key, el.value);
            break;
        }
      });
      const _url = url + "?" + urlSearchParams.toString();
      fetch(_url, {
        method: "GET",
        headers: {
          domx: domx.getHeaderData()
        }
      }).then((r) => r.json().then((transformations) => domx.transform(transformations)));
    };
    run();
  }
  async function innerHTMLTransformer(_, selector, html) {
    const el = document.querySelector(selector);
    if (!el)
      return;
    el.innerHTML = decodeURIComponent(html);
  }
  async function locationTransformer(_, url) {
    window.location.href = url;
  }
  async function postRequestTransformer(domx, url, data) {
    const run = () => {
      const formData = new FormData();
      data.forEach(([key, selector, prop, propKey]) => {
        switch (prop) {
          case "attribute":
            const el1 = document.querySelector(selector);
            if (!el1)
              return;
            formData.append(key, el1.getAttribute(propKey));
            break;
          case "dataset":
            const el2 = document.querySelector(selector);
            if (!el2)
              return;
            formData.append(key, el2.dataset[prop][propKey]);
            break;
          case "value":
            const el = document.querySelector(selector);
            if (!el)
              return;
            formData.append(key, el.value);
            break;
        }
      });
      fetch(url, {
        body: formData,
        method: "POST",
        headers: {
          domx: domx.getHeaderData()
        }
      }).then((r) => r.json().then((transformations) => domx.transform(transformations)));
    };
    run();
  }
  async function removeAttributeTransformer(_, selector, attr) {
    const els = getNodeListBySelector(selector);
    els.forEach((el) => el.removeAttribute(attr));
  }
  async function removeTransformer(_, selector) {
    const el = document.querySelector(selector);
    if (!el)
      return;
    el.remove();
  }
  async function removeEventListenerTransformer(domx, selector, event) {
    domx.removeEventListenersForSelector(selector, event);
  }
  async function removeClassTransformer(_, selector, className) {
    const els = getNodeListBySelector(selector);
    els.forEach((el) => el.classList.remove(className));
  }
  async function replaceTransformer(_, selector, html) {
    const el = document.querySelector(selector);
    if (!el)
      return;
    const newElement = document.createRange().createContextualFragment(html);
    el.replaceWith(newElement);
  }
  async function setAttributeTransformer(_, selector, attr, value) {
    const els = getNodeListBySelector(selector);
    els.forEach((el) => {
      if (value === null)
        return el.removeAttribute(attr);
      el.setAttribute(attr, value);
    });
  }
  async function stateTransformer(domx, state) {
    if (domx.fsm.states[state].exit)
      domx.dispatch("exit");
    domx.state = state;
    if (domx.fsm.states[state].entry)
      domx.dispatch("entry");
  }
  async function submitFormTransformer(domx, formSelector) {
    const form = document.querySelector(formSelector);
    const method = (form.method ?? "POST").toUpperCase();
    const enctype = form.enctype ?? "application/x-www-form-urlencoded";
    const formData = new FormData(form);
    fetch(form.action, {
      body: formData,
      method,
      headers: {
        domx: domx.getHeaderData(),
        contentType: enctype
      }
    }).then((r) => r.json().then((transformations) => domx.transform(transformations)));
  }
  async function textContentTransformer(_, selector, text) {
    const el = document.querySelector(selector);
    if (!el)
      return;
    el.textContent = decodeURIComponent(text);
  }
  async function triggerTransformer(_, selector, event) {
    const el = document.querySelector(selector);
    if (!el)
      return;
    el.dispatchEvent(new Event(event));
  }
  async function waitTransformer(domx, timeout) {
    clearTimeout(domx.debouncing);
    return new Promise((resolve) => domx.debouncing = setTimeout(resolve, timeout));
  }
  async function windowTransformer(_, method, ...args) {
    window[method](...args);
  }
  var Domx = class {
    constructor(fsm) {
      this.eventRegistry = [];
      this.debouncing = 0;
      this.fsm = {
        id: "",
        initialState: "",
        listeners: [],
        states: {}
      };
      this.state = "";
      this.subs = [];
      this.timeouts = {};
      this.tranformers = {};
      this.unsub = (s) => {
        this.subs = this.subs.filter((sub) => sub !== s);
      };
      this.addEventListenerToElement = this.addEventListenerToElement.bind(this);
      this.dispatch = this.dispatch.bind(this);
      this.init = this.init.bind(this);
      this.removeAllEventListeners = this.removeAllEventListeners.bind(this);
      this.removeEventListenersForSelector = this.removeEventListenersForSelector.bind(this);
      this.registerEventListeners = this.registerEventListeners.bind(this);
      this.sub = this.sub.bind(this);
      this.transform = this.transform.bind(this);
      this.addTransformer("addClass", addClassTransformer);
      this.addTransformer("addEventListener", addEventListenerTransformer);
      this.addTransformer("append", appendTransformer);
      this.addTransformer("console", consoleTransformer);
      this.addTransformer("dispatch", dispatchTransformer);
      this.addTransformer("innerHTML", innerHTMLTransformer);
      this.addTransformer("history", historyTransformer);
      this.addTransformer("get", getRequestTransformer);
      this.addTransformer("location", locationTransformer);
      this.addTransformer("post", postRequestTransformer);
      this.addTransformer("remove", removeTransformer);
      this.addTransformer("removeAttribute", removeAttributeTransformer);
      this.addTransformer("removeClass", removeClassTransformer);
      this.addTransformer("removeEventListener", removeEventListenerTransformer);
      this.addTransformer("replace", replaceTransformer);
      this.addTransformer("setAttribute", setAttributeTransformer);
      this.addTransformer("state", stateTransformer);
      this.addTransformer("submit", submitFormTransformer);
      this.addTransformer("textContent", textContentTransformer);
      this.addTransformer("trigger", triggerTransformer);
      this.addTransformer("wait", waitTransformer);
      this.addTransformer("window", windowTransformer);
      if (fsm)
        this.init(fsm);
    }
    addEventListenerToElement(selector, event, handler) {
      this.eventRegistry.push({ selector, event, handler });
      document.addEventListener(event, (e) => {
        const target = e.target;
        if (target && target.matches(selector)) {
          handler(e);
        }
      });
    }
    addTransformer(name, cb) {
      this.tranformers[name] = cb;
      return this;
    }
    dispatch(evt) {
      const transformations = this.fsm.states[this.state][evt];
      if (!transformations)
        return;
      const prevState = this.state;
      this.transform(transformations, () => {
        this.subs.forEach((s) => s(evt, prevState, this.state));
      });
    }
    getHeaderData() {
      return JSON.stringify({ id: this.fsm.id, state: this.state });
    }
    init(fsm) {
      this.fsm = fsm;
      this.registerEventListeners();
      const initState = fsm.states[fsm.initialState];
      this.state = fsm.initialState;
      if (initState.entry)
        this.dispatch("entry");
    }
    removeEventListenersForSelector(selector, event) {
      const listenersToRemove = this.eventRegistry.filter(
        (entry) => entry.selector === selector && entry.event === event
      );
      listenersToRemove.forEach((entry) => {
        document.removeEventListener(entry.event, entry.handler);
      });
      this.eventRegistry = this.eventRegistry.filter((entry) => !(entry.selector === selector && entry.event === event));
    }
    removeAllEventListeners() {
      this.eventRegistry.forEach((entry) => {
        document.removeEventListener(entry.event, entry.handler);
      });
      this.eventRegistry = [];
    }
    registerEventListeners() {
      const listeners = this.fsm.listeners ?? [];
      for (let i = 0; i < listeners.length; i++) {
        const [selector, eventListener, fsmEvent] = listeners[i];
        const els = getNodeListBySelector(selector);
        for (let j = 0; j < els.length; j++) {
          const el = els[j];
          const cb = (e) => {
            e.preventDefault();
            if (e.target !== el)
              return;
            this.dispatch(fsmEvent);
          };
          this.removeEventListenersForSelector(selector, eventListener);
          this.addEventListenerToElement(selector, eventListener, cb);
        }
      }
    }
    sub(s) {
      this.subs.push(s);
      return () => this.unsub(s);
    }
    async transform(transformations = [], cb) {
      if (!transformations)
        return;
      if (this.debouncing)
        return;
      for (let i = 0; i < transformations.length; i++) {
        const transformation = transformations[i];
        const [transformer, ...transformerArgs] = transformation;
        const transformerFn = this.tranformers[transformer];
        if (!transformerFn)
          throw new Error(`Unknown transformer: ${transformer}`);
        await transformerFn(this, ...transformerArgs);
      }
      if (cb)
        cb();
    }
  };
  var DomxCustomElement = class extends HTMLElement {
    constructor() {
      super();
      this.instance = new Domx();
      this.registerLocalFSM = this.registerLocalFSM.bind(this);
      this.registerRemoteFSM = this.registerRemoteFSM.bind(this);
      let slot = document.createElement("slot");
      slot.style.display = "none";
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(slot);
      slot.addEventListener("slotchange", () => this.registerLocalFSM(slot));
    }
    connectedCallback() {
      if (this.getAttribute("src"))
        this.registerRemoteFSM();
    }
    registerLocalFSM(slot) {
      const nodes = slot.assignedNodes();
      const local = nodes[0].nodeValue;
      if (local)
        return this.instance.init(JSON.parse(local));
    }
    registerRemoteFSM() {
      const remote = this.getAttribute("src");
      if (remote)
        return fetch(remote).then((r) => r.json().then(this.instance.init));
    }
  };
  customElements.define("dom-x", DomxCustomElement);
  window.Domx = Domx;
})();
//# sourceMappingURL=domx.js.map
