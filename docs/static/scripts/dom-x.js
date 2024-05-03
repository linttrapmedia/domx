"use strict";
(() => {
  // src/components/dom-x.ts
  function addClassTransformer(_, selector, className) {
    const els = document.querySelectorAll(selector);
    els.forEach((el) => el.classList.add(className));
  }
  function addEventListenerTransformer(domx, selector, event, fsmEvent) {
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
  function appendTransformer(_, selector, html) {
    const el = document.querySelector(selector);
    if (!el)
      return;
    const tmpl = document.createElement("template");
    tmpl.innerHTML = decodeURIComponent(html);
    el.append(tmpl.content);
  }
  function dispatchTransformer(domx, event, timeout = 0) {
    clearTimeout(domx.timeouts[event]);
    domx.timeouts[event] = setTimeout(() => domx.dispatch(event), timeout);
  }
  function historyTransformer(_, state, title, url) {
    window.history.pushState(state, title, url);
  }
  function getRequestTransformer(domx, url) {
    fetch(url, {
      method: "GET"
    }).then((r) => r.json().then((transformations) => domx.transform(transformations)));
  }
  function innerHTMLTransformer(_, selector, html) {
    const el = document.querySelector(selector);
    if (!el)
      return;
    el.innerHTML = decodeURIComponent(html);
  }
  function locationTransformer(_, url) {
    window.location.href = url;
  }
  function postRequestTransformer(domx, formSelector) {
    const form = document.querySelector(formSelector);
    const formData = new FormData(form);
    fetch(form.action, {
      body: formData,
      method: "POST"
    }).then((r) => r.json().then((transformations) => domx.transform(transformations)));
  }
  function textContentTransformer(_, selector, text) {
    const el = document.querySelector(selector);
    if (!el)
      return;
    el.textContent = decodeURIComponent(text);
  }
  function removeAttributeTransformer(_, selector, attr) {
    const els = document.querySelectorAll(selector);
    els.forEach((el) => el.removeAttribute(attr));
  }
  function removeEventListenerTransformer(domx, selector, event, fsmEvent) {
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
  function removeClassTransformer(_, selector, className) {
    const els = document.querySelectorAll(selector);
    els.forEach((el) => el.classList.remove(className));
  }
  function replaceTransformer(_, selector, html) {
    const el = document.querySelector(selector);
    if (!el)
      return;
    const tmpl = document.createElement("template");
    tmpl.innerHTML = decodeURIComponent(html);
    el.replaceWith(tmpl.content);
  }
  function setAttributeTransformer(_, selector, attr, value) {
    const els = document.querySelectorAll(selector);
    els.forEach((el) => {
      if (value === null)
        return el.removeAttribute(attr);
      el.setAttribute(attr, value);
    });
  }
  function waitTransformer(_, timeout) {
    const startTime = new Date().getTime();
    while (new Date().getTime() - startTime < timeout) {
    }
  }
  function windowTransformer(_, method, ...args) {
    window[method](...args);
  }
  function stateTransformer(domx, state) {
    domx.state = state;
    if (domx.fsm.states[state].entry)
      domx.dispatch("entry");
  }
  var Domx = class extends HTMLElement {
    constructor() {
      super();
      this.state = "";
      this.fsm = {
        initialState: "",
        listeners: [],
        states: {}
      };
      this.subs = [];
      this.timeouts = {};
      this.tranformers = {};
      this.unsub = (s) => {
        this.subs = this.subs.filter((sub) => sub !== s);
      };
      this.dispatch = this.dispatch.bind(this);
      this.init = this.init.bind(this);
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
      this.addTransformer("textContent", textContentTransformer);
      this.addTransformer("wait", waitTransformer);
      this.addTransformer("window", windowTransformer);
    }
    addTransformer(name, cb) {
      this.tranformers[name] = cb;
      return this;
    }
    connectedCallback() {
      const src = this.getAttribute("src");
      if (src)
        return fetch(src).then((r) => r.json().then(this.init));
      const obj = this.getAttribute("obj");
      if (obj)
        return this.init(window[obj]);
      return;
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
    init(fsm) {
      this.fsm = fsm;
      const listeners = this.fsm.listeners ?? [];
      const register = () => {
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
      };
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList" && mutation.addedNodes)
            register();
        });
      });
      observer.observe(this, {
        attributes: true,
        childList: true,
        subtree: true
      });
      register();
      const initState = fsm.states[fsm.initialState];
      this.state = fsm.initialState;
      if (initState.entry)
        this.dispatch("entry");
    }
    sub(s) {
      this.subs.push(s);
      return () => this.unsub(s);
    }
    transform(transformations = [], cb) {
      if (!transformations)
        return;
      for (let i = 0; i < transformations.length; i++) {
        const transformation = transformations[i];
        const [transformer, ...transformerArgs] = transformation;
        const transformerFn = this.tranformers[transformer];
        if (!transformerFn)
          throw new Error(`Unknown transformer: ${transformer}`);
        transformerFn(this, ...transformerArgs);
      }
      if (cb)
        cb();
    }
  };
  customElements.define("dom-x", Domx);
})();
//# sourceMappingURL=dom-x.js.map
