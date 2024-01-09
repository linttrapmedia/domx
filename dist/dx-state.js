"use strict";
(() => {
  // src/components/dx-state.ts
  var DomxState = class extends HTMLElement {
    constructor() {
      super();
      this.state = "";
      this.config = {
        actions: {},
        initialState: "",
        listeners: [],
        states: {}
      };
      this.subs = [];
      this.timeouts = {};
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
    applyAction(transformation) {
      const [, action] = transformation;
      this.config.actions[action].forEach((t) => this.transform(action, [t]));
    }
    applyAppend(transformation) {
      const [, selector, html] = transformation;
      const el = this.querySelector(selector);
      if (!el)
        return;
      const tmpl = document.createElement("template");
      tmpl.innerHTML = decodeURIComponent(html);
      el.append(tmpl.content);
    }
    applyAttr(transformation) {
      const [, selector, attr, value] = transformation;
      const els = this.querySelectorAll(selector);
      els.forEach((el) => {
        if (value === null)
          return el.removeAttribute(attr);
        el.setAttribute(attr, value);
      });
    }
    applyCall(transformation) {
      const [, selector, method, ...args] = transformation;
      const el = this.querySelector(selector);
      if (!el)
        return;
      el[method](...args);
    }
    applyEventListener(transformation) {
      const [event, selector, action] = transformation;
      const els = this.querySelectorAll(selector);
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        const cb = (e) => {
          e.preventDefault();
          this.handleClientEvent(action);
        };
        el.removeEventListener(event, cb);
        el.addEventListener(event, cb);
      }
    }
    applyDispatch(transformation) {
      const [, action, timeout = 0] = transformation;
      clearTimeout(this.timeouts[action]);
      this.timeouts[action] = setTimeout(
        () => this.handleClientEvent(action),
        timeout
      );
    }
    applyGet(transformation) {
      const [, url] = transformation;
      fetch(url, {
        method: "GET"
      }).then((r) => r.json().then((d) => this.transform("entry", d)));
    }
    applyJs(transformation) {
      const [, method, ...args] = transformation;
      window[method](...args);
    }
    applyPost(transformation) {
      const [, url, ...data] = transformation;
      const body = {};
      for (let i = 0; i < data.length; i++) {
        const [key, selector, val] = data[i];
        const el = this.querySelector(selector);
        if (!el)
          return;
        body[key] = el[val];
      }
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }).then((r) => r.json().then((d) => this.transform("entry", d)));
    }
    applyReplace(transformation) {
      const [, selector, content] = transformation;
      const el = this.querySelector(selector);
      if (!el)
        return;
      const parent = el.parentElement;
      if (!parent)
        return;
      const tmpl = document.createElement("template");
      tmpl.innerHTML = decodeURIComponent(content);
      parent.replaceChild(tmpl.content, el);
    }
    applyState(transformation) {
      const [, state] = transformation;
      const hasEntry = this.config.states[state].entry;
      if (hasEntry)
        this.transform("entry", this.config.states[state].entry);
      this.state = state;
    }
    applyText(transformation) {
      const [, selector, text] = transformation;
      const els = this.querySelectorAll(selector);
      els.forEach((el) => el.textContent = text);
    }
    applyWait(transformation) {
      const [, timeInSeconds, action] = transformation;
      const startTime = new Date().getTime();
      while (new Date().getTime() - startTime < timeInSeconds) {
      }
      if (action)
        this.handleClientEvent(action);
    }
    connectedCallback() {
      const src = this.getAttribute("src");
      if (!src)
        return;
      fetch(src).then((r) => r.json().then(this.init));
    }
    dispatch(action) {
      this.handleClientEvent(action);
    }
    handleClientEvent(action) {
      this.transform(action, this.config.states[this.state][action]);
    }
    handleServerEvent(se) {
      const { action } = se;
      const transformations = this.config.states[this.state][action].reduce(
        (acc, t) => [...acc, t],
        []
      );
      this.transform(action, transformations);
    }
    init(config) {
      this.config = config;
      const that = this;
      const listeners = this.config.listeners ?? [];
      const register = () => {
        for (let i = 0; i < listeners.length; i++) {
          const [selector, event, action] = listeners[i];
          const els = this.querySelectorAll(selector);
          for (let j = 0; j < els.length; j++) {
            const el = els[j];
            const cb = (e) => {
              e.preventDefault();
              if (e.target !== el)
                return;
              this.handleClientEvent(action);
            };
            that.removeEventListener(event, cb);
            that.addEventListener(event, cb);
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
      const initState = config.states[config.initialState];
      this.state = config.initialState;
      if (initState.entry)
        this.transform("entry", initState.entry);
    }
    sub(s) {
      this.subs.push(s);
    }
    transform(action, transformations) {
      if (!transformations)
        return;
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
          wait: this.applyWait
        };
        traitMap[trait](transformation);
        this.subs.forEach((s) => s(this.state, action, transformation));
      }
    }
  };
  customElements.define("dx-state", DomxState);
})();
