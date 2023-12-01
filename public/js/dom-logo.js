(() => {
  // src/dom-logo.ts
  var DomLogo = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      const style = this.renderCSS(`
        .wrapper {
            color: red;
        }
    `);
      const html = this.renderHTML(`
        <div class='wrapper'>
            Hello
        </div>
    `);
      this.shadowRoot.append(style, html);
    }
    renderHTML(htmlObj) {
      const template = document.createElement("template");
      template.innerHTML = htmlObj.trim();
      return template.content.cloneNode(true);
    }
    renderCSS(cssObj) {
      const style = document.createElement("style");
      style.textContent = cssObj.trim();
      return style;
    }
    connectedCallback() {
    }
    disconnectedCallback() {
    }
    attributeChangedCallback(name, oldValue, newValue) {
    }
    static get observedAttributes() {
      return [];
    }
  };
  customElements.define("dom-logo", DomLogo);
})();
//# sourceMappingURL=dom-logo.js.map
