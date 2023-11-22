(() => {
  class DomContext extends HTMLElement {
    constructor() {
      super();
      this.init = this.init.bind(this);
      this.handleClientEvent = this.handleClientEvent.bind(this);
      this.transform = this.transform.bind(this);
      this.applyAppend = this.applyAppend.bind(this);
      this.applyAttr = this.applyAttr.bind(this);
      this.applyCall = this.applyCall.bind(this);
      this.applyClick = this.applyClick.bind(this);
      this.applyJs = this.applyJs.bind(this);
      this.applyPost = this.applyPost.bind(this);
      this.applyState = this.applyState.bind(this);
      this.applyWait = this.applyWait.bind(this);
      this.handleServerEvent = this.handleServerEvent.bind(this);
    }
    connectedCallback() {
      const src = this.getAttribute("src");
      if (!src)
        return;
      fetch(src).then((r) => r.json().then(this.init));
    }
    handleClientEvent(event) {
      this.transform(this.config.states[this.state][event]);
    }
    handleServerEvent(se) {
      const { event, dx } = se;
      const transformations = this.config.states[this.state][event].reduce(
        (acc, t) => {
          if (t[0] === "server")
            return [...acc, ...dx];
          return [...acc, t];
        },
        []
      );
      this.transform(transformations);
    }
    init(config) {
      this.config = config;
      const initState = config.states[config.initialState];
      if (initState.entry)
        this.transform(initState.entry);
    }
    transform(transformations) {
      for (let i = 0; i < transformations.length; i++) {
        const transformation2 = transformations[i];
        const [trait] = transformation2;
        switch (trait) {
          case "append":
            this.applyAppend(transformation2);
            break;
          case "attr":
            this.applyAttr(transformation2);
            break;
          case "click":
            this.applyClick(transformation2);
            break;
          case "call":
            this.applyCall(transformation2);
            break;
          case "js":
            this.applyJs(transformation2);
            break;
          case "post":
            this.applyPost(transformation2);
            break;
          case "state":
            this.applyState(transformation2);
            break;
          case "wait":
            this.applyWait(transformation2);
            break;
        }
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
