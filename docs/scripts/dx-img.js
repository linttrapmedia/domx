"use strict";
(() => {
  // src/helpers.ts
  function mergeByIndex(arr1, arr2) {
    let merged = [...arr1];
    for (let i = 0; i < arr2.length; i++) {
      if (i < merged.length) {
        merged[i] = arr2[i];
      } else {
        merged.push(arr2[i]);
      }
    }
    return merged;
  }
  function attachShadow(el, init) {
    el.attachShadow(init);
  }
  function attachStyles(el, styles2) {
    let sheet = new CSSStyleSheet();
    sheet.replace(styles2);
    el.shadowRoot.adoptedStyleSheets = [sheet];
    return sheet;
  }
  function attachTemplate(el, template2) {
    const templateEl = document.createElement("template");
    templateEl.innerHTML = template2;
    const node = templateEl.content.cloneNode(true);
    el.shadowRoot.appendChild(node);
    return node;
  }

  // src/dx-img.ts
  var styles = `
:host {
  font-size: var(--dx-text-size, 14px);
  font-family: var(--dx-text-font, Arial);
  color: var(--dx-text-color, #000);
}
:host img {
  transition: all 0.2s ease-in-out;
}
`;
  var template = `<slot></slot>`;
  var DomImg = class extends HTMLElement {
    constructor() {
      super();
      this.preload = false;
      this.breakpoints = [0, 960, 1440];
      this.height = ["auto"];
      this.width = ["auto"];
      attachShadow(this, { mode: "open" });
      attachStyles(this, styles);
      attachTemplate(this, template);
      this.render = this.render.bind(this);
      this.setupImageAndLazyLoading = this.setupImageAndLazyLoading.bind(this);
      this.setupPreloading = this.setupPreloading.bind(this);
      this.setupAttributes = this.setupAttributes.bind(this);
      this.connectedCallback = this.connectedCallback.bind(this);
    }
    connectedCallback() {
      this.setupAttributes().setupPreloading().setupImageAndLazyLoading().render();
      window.addEventListener("resize", this.render);
    }
    disconnectedCallback() {
      window.removeEventListener("resize", this.render);
    }
    render() {
      const width = window.innerWidth;
      this.breakpoints.forEach((bp, i) => {
        if (width > bp) {
          if (this.height[i])
            this.img.style.height = this.height[i];
          if (this.width[i])
            this.img.style.width = this.width[i];
        }
      });
    }
    setupAttributes() {
      DomImg.observedAttributes.forEach((attr) => {
        const val = this.getAttribute(attr);
        if (!val)
          return;
        if (!Array.isArray(this[attr]))
          return this[attr] = val;
        return this[attr] = mergeByIndex(this[attr], val.split(","));
      });
      return this;
    }
    setupImageAndLazyLoading() {
      const img = document.createElement("img");
      this.shadowRoot?.appendChild(img);
      this.img = img;
      if (this["lazy-src"]) {
        this.img.src = this["lazy-src"];
        let observer = new IntersectionObserver((entries, observer2) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              let target = entry.target;
              target.src = this.src;
              observer2.unobserve(target);
            }
          });
        });
        observer.observe(img);
      } else {
        this.img.src = this.src;
      }
      return this;
    }
    setupPreloading() {
      if (this.getAttribute("preload") !== null) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = this.src;
        document.head.appendChild(link);
      }
      return this;
    }
    static get observedAttributes() {
      return ["height", "lazy-src", "preload", "src", "width"];
    }
  };
  customElements.define("dx-img", DomImg);
})();
//# sourceMappingURL=dx-img.js.map
