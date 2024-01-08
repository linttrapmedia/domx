class DomGrid extends HTMLElement {
  baseStyles: string[][] = [
    ["box-sizing", "border-box"],
    ["display", "grid"],
  ];
  psuedoStyles: Record<string, [string, string][]> = {};
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = "<slot></slot>";
    this.render = this.render.bind(this);
    this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") this.render();
      });
    });
    observer.observe(this, { attributes: true });
  }
  connectedCallback() {
    this.render();
    window.addEventListener("resize", this.render);
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.render);
  }
  render() {
    let styles = this.baseStyles;
    let psuedoStyles: Record<string, [string, string][]> = {};
    this.getAttributeNames().forEach((attributeName) => {
      const [style, bp] = attributeName.split("--");
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
    const hostStyles = `:host{ ${styles
      .map(([attr, value]) => `${attr}:${value};`)
      .join("")}}`;

    // generate host psuedo styles
    const hostPsuedoStyles = Object.entries(psuedoStyles)
      .map(([psuedo, styles]) => {
        const _styles = styles
          .map(([attr, value]) => `${attr}:${value};`)
          .join("");
        return `:host(:${psuedo}) { ${_styles} }`;
      })
      .join("");

    this.styleSheet.replace(hostStyles + hostPsuedoStyles);
  }
}

customElements.define("dx-grid", DomGrid);
