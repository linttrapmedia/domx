(() => {
  class DomContext extends HTMLElement {
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
    }
    connectedCallback() {
      const src = this.getAttribute("src");
      if (!src)
        return;
      fetch(src).then((r) => r.json().then(this.init));
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
      this.transform(this.config.states[this.state][event]);
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
      this.transform(transformations);
    }
    init(config) {
      this.config = config;
      const initState = config.states[config.initialState];
      this.state = config.initialState;
      if (initState.entry)
        this.transform(initState.entry);
      this.autoBind();
    }
    transform(transformations) {
      for (let i = 0; i < transformations.length; i++) {
        const transformation2 = transformations[i];
        const [trait] = transformation2;
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
        traitMap[trait](transformation2);
      }
    }
    applyAppend(transformation2) {
      const [, selector, html] = transformation2;
      const el = this.querySelector(selector);
      if (!el)
        return;
      const tmpl = document.createElement("template");
      tmpl.innerHTML = decodeURIComponent(html);
      el.append(tmpl.content);
    }
    applyAttr(transformation2) {
      const [, selector, attr, value] = transformation2;
      const el = this.querySelector(selector);
      if (!el)
        return;
      if (value === null)
        return el.removeAttribute(attr);
      el.setAttribute(attr, value);
    }
    applyClick(transformation2) {
      const [, selector, event] = transformation2;
      const el = this.querySelector(selector);
      if (!el)
        return;
      el?.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleClientEvent(event);
      });
    }
    applyCall(transformation2) {
      const [, selector, method2, ...args2] = transformation2;
      const el = this.querySelector(selector);
      if (!el)
        return;
      el[method2](...args2);
    }
    applyGet(transformation2) {
      const [, url] = transformation2;
      fetch(url, {
        method: "GET"
      }).then((r) => r.json().then(this.handleServerEvent));
    }
    applyJs(transformation) {
      const [, method, ...args] = transformation;
      const m = eval(method);
      m(...args);
    }
    applyPost(transformation2) {
      const [, url, ...data] = transformation2;
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
    applyReplace(transformation2) {
      const [, selector, content] = transformation2;
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
    applyState(transformation2) {
      const [, state] = transformation2;
      this.state = state;
    }
    applyWait(transformation2) {
      const [, timeInSeconds] = transformation2;
      const startTime = new Date().getTime();
      while (new Date().getTime() - startTime < timeInSeconds) {
      }
    }
  }
  customElements.define("dom-context", DomContext);
})();
