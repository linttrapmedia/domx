(() => {
  function m(o) {
    let {
      tagName: s,
      template: n,
      style: l,
      observedAttributes: c,
      methods: e,
    } = o;
    class a extends HTMLElement {
      constructor() {
        if ((super(), this.attachShadow({ mode: "open" }), l)) {
          let t = document.createElement("style");
          (t.textContent = l), this.shadowRoot.appendChild(t);
        }
        if (n) {
          let t = document.createElement("template");
          (t.innerHTML = n),
            this.shadowRoot.appendChild(t.content.cloneNode(!0));
        }
      }
      connectedCallback() {
        e?.connectedCallback?.call(this);
      }
      disconnectedCallback() {
        e?.disconnectedCallback?.call(this);
      }
      attributeChangedCallback(t, i, r) {
        e?.attributeChangedCallback?.call(this, t, i, r);
      }
      static get observedAttributes() {
        return c || [];
      }
    }
    return customElements.define(s, a), a;
  }
})();
//# sourceMappingURL=util.js.map
