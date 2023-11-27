(() => {
  // src/dom-machine.ts
  var DomMachine = class extends HTMLElement {
    constructor() {
      super();
      this.subs = [];
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
      if (!src)
        return;
      fetch(src).then((r) => r.json().then(this.init));
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
      const el = this.querySelector(selector);
      if (!el)
        return;
      if (value === null)
        return el.removeAttribute(attr);
      el.setAttribute(attr, value);
    }
    applyClick(transformation) {
      const [, selector, event] = transformation;
      const el = this.querySelector(selector);
      if (!el)
        return;
      el?.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleClientEvent(event);
      });
    }
    applyCall(transformation) {
      const [, selector, method, ...args] = transformation;
      const el = this.querySelector(selector);
      if (!el)
        return;
      el[method](...args);
    }
    applyGet(transformation) {
      const [, url] = transformation;
      fetch(url, {
        method: "GET"
      }).then((r) => r.json().then(this.handleServerEvent));
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
      }).then((r) => r.json().then(this.handleServerEvent));
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
      this.state = state;
    }
    applyWait(transformation) {
      const [, timeInSeconds] = transformation;
      const startTime = new Date().getTime();
      while (new Date().getTime() - startTime < timeInSeconds) {
      }
    }
    autoBind() {
      const bindMap = [["click", this.querySelectorAll("[dx\\:click]")]];
      for (let i = 0; i < bindMap.length; i++) {
        const [event, els] = bindMap[i];
        for (let j = 0; j < els.length; j++) {
          const el = els[j];
          const dx = el.getAttribute(`dx:${event}`);
          if (!dx)
            continue;
          el.addEventListener(event, (e) => {
            e.preventDefault();
            this.handleClientEvent(dx);
          });
        }
      }
    }
    handleClientEvent(event) {
      this.transform(event, this.config.states[this.state][event]);
    }
    handleServerEvent(se) {
      const { event } = se;
      const transformations = this.config.states[this.state][event].reduce(
        (acc, t) => {
          const [dx, key] = t;
          if (dx === "server")
            return [...acc, ...se[key]];
          return [...acc, t];
        },
        []
      );
      this.transform(event, transformations);
    }
    init(config) {
      this.config = config;
      const initState = config.states[config.initialState];
      this.state = config.initialState;
      if (initState.entry)
        this.transform("entry", initState.entry);
      this.autoBind();
    }
    sub(s) {
      this.subs.push(s);
    }
    transform(event, transformations) {
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
          wait: this.applyWait
        };
        traitMap[trait](transformation);
        this.subs.forEach((s) => s(this.state, event, transformation));
      }
    }
  };
  customElements.define("dom-machine", DomMachine);
})();
