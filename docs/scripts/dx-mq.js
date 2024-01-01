"use strict";
(() => {
  // src/helpers.ts
  function attachShadow(el, init) {
    el.attachShadow(init);
  }
  function attachStyles(el, styles) {
    let sheet = new CSSStyleSheet();
    sheet.replace(styles);
    el.shadowRoot.adoptedStyleSheets = [sheet];
    return sheet;
  }
  function attachTemplate(el, template) {
    const templateEl = document.createElement("template");
    templateEl.innerHTML = template;
    const node = templateEl.content.cloneNode(true);
    el.shadowRoot.appendChild(node);
    return node;
  }

  // src/dx-mq.ts
  var DomMQ = class extends HTMLElement {
    constructor() {
      super();
      this.subscribers = [];
      attachShadow(this, { mode: "open" });
      attachStyles(this, `:host { display:block; width:100%; height: 100%; }`);
      this.calculateBreakpoint = this.calculateBreakpoint.bind(this);
      this.subscribe = this.subscribe.bind(this);
      this.update = this.update.bind(this);
      this.template = attachTemplate(this, `<slot></slot>`);
    }
    calculateBreakpoint() {
      const width = window.innerWidth;
      let bp = "sm";
      const sm = Number(this.getAttribute("sm") ?? "0");
      const md = Number(this.getAttribute("md") ?? "640");
      const lg = Number(this.getAttribute("lg") ?? "1024");
      const xl = Number(this.getAttribute("xl") ?? "1280");
      const xxl = Number(this.getAttribute("xxl") ?? "1536");
      if (width > 0)
        bp = "sm";
      if (width >= sm)
        bp = "sm";
      if (width >= md)
        bp = "md";
      if (width >= lg)
        bp = "lg";
      if (width >= xl)
        bp = "xl";
      if (width >= xxl)
        bp = "xxl";
      return bp;
    }
    connectedCallback() {
      this.update();
      window.addEventListener("resize", this.update);
    }
    subscribe(node) {
      this.subscribers.push(node);
    }
    update() {
      for (let i = 0; i < this.subscribers.length; i++) {
        this.subscribers[i].render(this.calculateBreakpoint());
      }
    }
    disconnectedCallback() {
      window.removeEventListener("resize", this.update);
    }
    static get observedAttributes() {
      return ["sm", "md", "lg", "xl", "xxl"];
    }
  };
  customElements.define("dx-mq", DomMQ);
})();
//# sourceMappingURL=dx-mq.js.map
