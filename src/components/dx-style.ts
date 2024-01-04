class DomStyle extends HTMLElement {
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = `<slot></slot>`;
    this.render = this.render.bind(this);
    this.renderStyle = this.renderStyle.bind(this);
    this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") this.render();
        if (mutation.type === "childList")
          this.renderStyle(mutation.addedNodes);
      });
    });
    observer.observe(this, { attributes: true, childList: true });
  }
  connectedCallback() {
    window.addEventListener("resize", this.render);
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.render);
  }
  render() {
    this.renderStyle(this.shadowRoot!.childNodes);
    // apply to host to protect from inheritance
    this.styleSheet.replace(`:host { display:inherit; }`);
  }
  renderStyle(nodes: NodeList) {
    let currentNode = 1;
    nodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) return;

      const isDxElement = (node as any).tagName?.startsWith("DX-");
      // If this is a dx component, pass along the attributes
      if (isDxElement) {
        return this.getAttributeNames().forEach((attributeName) => {
          node.setAttribute(attributeName, this.getAttribute(attributeName)!);
        });
      } else {
        console.log(node, currentNode);
        let styles: string[][] = [];
        let psuedoStyles: Record<string, [string, string][]> = {};
        this.getAttributeNames().forEach((attributeName) => {
          const [style, bp] = attributeName.split("__");
          const [attr, psuedo] = style.split(":");
          const breakpoint = Number(bp ?? 0);
          if (window.innerWidth < breakpoint) return;
          const value = (this as any).getAttribute(attributeName);
          if (psuedo) {
            if (!psuedoStyles[psuedo]) psuedoStyles[psuedo] = [];
            psuedoStyles[psuedo].push([attr, value]);
          } else {
            styles.push([attr, value]);
          }
        });

        // generate host styles
        const hostStyles = `::slotted(:nth-child(${currentNode})) { ${styles
          .map(([attr, value]) => `${attr}:${value};`)
          .join("")}}`;

        // generate host psuedo styles
        const hostPsuedoStyles = Object.entries(psuedoStyles)
          .map(([psuedo, styles]) => {
            const _styles = styles
              .map(([attr, value]) => `${attr}:${value};`)
              .join("");
            return `::slotted(:nth-child(${currentNode}):${psuedo}) { ${_styles} }`;
          })
          .join("");

        this.styleSheet.insertRule(hostStyles);
        this.styleSheet.insertRule(hostPsuedoStyles);
      }

      currentNode++;
    });
  }
}

customElements.define("dx-style", DomStyle);
