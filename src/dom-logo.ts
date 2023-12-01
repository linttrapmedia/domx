class DomLogo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // styles
    const style = this.renderCSS(`
        .wrapper {
            color: red;
        }
    `);

    // html
    const html = this.renderHTML(`
        <div class='wrapper'>
            Hello
        </div>
    `);

    // append
    (this as any).shadowRoot.append(style, html);
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
    // element attached to the DOM
  }

  disconnectedCallback() {
    // element removed from the DOM
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // attribute value changed
  }

  static get observedAttributes() {
    return [];
  }
}

customElements.define("dom-logo", DomLogo);
