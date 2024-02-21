import * as DOMPurify from "dompurify";

class DxInclude extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["src"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "src" && newValue !== oldValue) this.loadContent(newValue);
  }

  async loadContent(src: string) {
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`${src} not found`);
      const text = await response.text();
      this.shadowRoot!.innerHTML = this.sanitizeHTML(text);
    } catch (error) {
      console.error(error);
      this.shadowRoot!.innerHTML = `<p>Error loading content from ${src}</p>`;
    }
  }

  sanitizeHTML(html: string) {
    return DOMPurify.sanitize(html, {
      CUSTOM_ELEMENT_HANDLING: {
        tagNameCheck: /^dx-/, // only allow dx tags
        attributeNameCheck: /./, // allow all attributes containing "baz"
        allowCustomizedBuiltInElements: true, // customized built-ins are allowed
      },
    });
  }
}

customElements.define("dx-include", DxInclude);
