import * as DOMPurify from "dompurify";

export class DomxInclude extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["src", "onload"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "src" && newValue !== oldValue) this.loadContent(newValue);
  }

  async loadContent(src: string) {
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`${src} not found`);
      const text = await response.text();
      this.innerHTML = this.sanitizeHTML(text);
      this.dispatchEvent(new CustomEvent("loaded"));
      this.offsetWidth; // force reflow
    } catch (error) {
      console.error(error);
      this.innerHTML = `<p>Error loading content from ${src}</p>`;
    }
  }

  sanitizeHTML(html: string) {
    return DOMPurify.sanitize(html, {
      CUSTOM_ELEMENT_HANDLING: {
        tagNameCheck: /^dx-/, // Only allow custom elements starting with dx-
        attributeNameCheck: /./, // Allow all attributes
        allowCustomizedBuiltInElements: true, // Customized built-ins are allowed
      },
    });
  }
}

customElements.define("dx-include", DomxInclude);
