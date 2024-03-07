"use strict";
(() => {
  // src/components/dx-prismjs.ts
  var DxPrismjs = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.loadScript = this.loadScript.bind(this);
      this.loadCSS = this.loadCSS.bind(this);
    }
    async connectedCallback() {
      const src = this.getAttribute("src") ?? "https://cdnjs.com/libraries/prism";
      const language = this.getAttribute("language") || "javascript";
      const div = document.createElement("div");
      div.style.textAlign = "left";
      div.style.borderRadius = "5px";
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.className = `language-${language}`;
      code.textContent = this.textContent;
      pre.appendChild(code);
      div.appendChild(pre);
      this.shadowRoot.appendChild(div);
      this.loadCSS(src + "/prism.css").then(() => this.loadScript(src + `/prism.min.js`)).then(() => this.loadScript(src + `/prism-${language}.min.js`)).then(() => Prism.highlightElement(code)).catch((error) => {
        console.error("Failed to load scripts:", error);
      });
    }
    loadCSS(href) {
      return new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.onload = () => resolve(null);
        link.onerror = (error) => reject(error);
        this.shadowRoot.appendChild(link);
      });
    }
    loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve(null);
        script.onerror = (error) => reject(error);
        this.shadowRoot.appendChild(script);
      });
    }
  };
  customElements.define("dx-prismjs", DxPrismjs);
})();
//# sourceMappingURL=dx-prismjs.js.map
