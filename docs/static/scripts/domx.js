"use strict";
(() => {
  // src/domx.ts
  async function addClassTransformer(_, selector, className) {
    const els = document.querySelectorAll(selector);
    els.forEach((el) => el.classList.add(className));
  }
  async function addEventListenerTransformer(domx, selector, event, fsmEvent) {
    const els = document.querySelectorAll(selector);
    els.forEach((el) => {
      const cb = (e) => {
        e.preventDefault();
        if (e.target !== el)
          return;
        domx.dispatch(fsmEvent);
      };
      el.removeEventListener(event, cb);
      el.addEventListener(event, cb);
    });
  }
  async function appendTransformer(_, selector, html) {
    const el = document.querySelector(selector);
    if (!el)
      return;
    const tmpl = document.createElement("template");
    tmpl.innerHTML = decodeURIComponent(html);
    el.append(tmpl.content);
  }
  async function dispatchTransformer(domx, event, timeout = 0) {
    clearTimeout(domx.timeouts[event]);
    domx.timeouts[event] = setTimeout(() => domx.dispatch(event), timeout);
  }
  async function historyTransformer(_, state, title, url) {
    window.history.pushState(state, title, url);
  }
  async function getRequestTransformer(domx, url, ...data) {
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
  async function postRequestTransformer(domx, url, ...data) {
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
  }
  async function textContentTransformer(_, selector, text) {
    const el = document.querySelector(selector);
    if (!el)
      return;
    el.textContent = decodeURIComponent(text);
  }
  async function removeAttributeTransformer(_, selector, attr) {
    const els = document.querySelectorAll(selector);
    els.forEach((el) => el.removeAttribute(attr));
  }
  async function removeEventListenerTransformer(domx, selector, event, fsmEvent) {
    const els = document.querySelectorAll(selector);
    els.forEach((el) => {
      const cb = (e) => {
        e.preventDefault();
        if (e.target !== el)
          return;
        domx.dispatch(fsmEvent);
      };
      el.removeEventListener(event, cb);
    });
  }
  async function removeClassTransformer(_, selector, className) {
    const els = document.querySelectorAll(selector);
    els.forEach((el) => el.classList.remove(className));
  }
  async function replaceTransformer(_, selector, html) {
    const el = document.querySelector(selector);
    if (!el)
      return;
    const tmpl = document.createElement("template");
    tmpl.innerHTML = decodeURIComponent(html);
    el.replaceWith(tmpl.content);
  }
  async function setAttributeTransformer(_, selector, attr, value) {
    const els = document.querySelectorAll(selector);
    els.forEach((el) => {
      if (value === null)
        return el.removeAttribute(attr);
      el.setAttribute(attr, value);
    });
  }
  async function stateTransformer(domx, state) {
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
  async function waitTransformer(_, timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }
  async function windowTransformer(_, method, ...args) {
    window[method](...args);
  }
  var Domx = class {
    constructor(fsm) {
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
      this.dispatch = this.dispatch.bind(this);
      this.init = this.init.bind(this);
      this.registerEventListeners = this.registerEventListeners.bind(this);
      this.sub = this.sub.bind(this);
      this.transform = this.transform.bind(this);
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
      this.addTransformer("submit", submitFormTransformer);
      this.addTransformer("textContent", textContentTransformer);
      this.addTransformer("wait", waitTransformer);
      this.addTransformer("window", windowTransformer);
      if (fsm)
        document.addEventListener("DOMContentLoaded", () => this.init(fsm));
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
    registerEventListeners() {
      const listeners = this.fsm.listeners ?? [];
      for (let i = 0; i < listeners.length; i++) {
        const [selector, eventListener, fsmEvent] = listeners[i];
        const els = document.querySelectorAll(selector);
        for (let j = 0; j < els.length; j++) {
          const el = els[j];
          const cb = (e) => {
            e.preventDefault();
            if (e.target !== el)
              return;
            this.dispatch(fsmEvent);
          };
          el.removeEventListener(eventListener, cb);
          el.addEventListener(eventListener, cb);
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
