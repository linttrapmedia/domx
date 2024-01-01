class DomText extends HTMLElement {
  align: string[] = [];
  breakpoints: number[] = [0, 960, 1440];
  color: string[] = [""];
  font: string[] = ["primary"];
  size: string[] = [""];
  shadow: string[] = [];
  spacing: string[] = [];
  oblique: string[] = [];
  opacity: string[] = [];
  weight: string[] = [];
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = "<slot></slot>";
    this.render = this.render.bind(this);
    this.setupAttributes = this.setupAttributes.bind(this);
    this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
  }
  connectedCallback() {
    this.setupAttributes().render();
    window.addEventListener("resize", this.render);
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.render);
  }
  render() {
    let styles = "";
    const applyStyle = (attr: string, prop: string, val: string) => {
      if (!(<any>this)[attr] || !val) return;
      const _val = val.slice(0, 2) === "--" ? `var(${val})` : val;
      styles += `${prop}: ${_val};`;
      return;
    };
    this.breakpoints.forEach((bp, i) => {
      if (window.innerWidth > bp) {
        applyStyle("align", "text-align", this.align[i]);
        applyStyle("color", "color", this.color[i]);
        applyStyle("font", "font-family", this.font[i]);
        applyStyle("opacity", "opacity", this.opacity[i]);
        applyStyle("shadow", "text-shadow", this.shadow[i]);
        applyStyle("size", "font-size", this.size[i]);
        applyStyle("spacing", "letter-spacing", this.spacing[i]);
        applyStyle("weight", "font-weight", this.weight[i]);
      }
      this.styleSheet.replace(`:host { ${styles} }`);
      console.log(styles);
    });
  }
  setupAttributes() {
    DomText.observedAttributes.forEach((attr) => {
      const val = this.getAttribute(attr);
      if (!val) return;
      (<any>this)[attr] = val.split(",");
    });
    return this;
  }
  static get observedAttributes() {
    return [
      "align",
      "breakpoints",
      "color",
      "font",
      "opacity",
      "shadow",
      "size",
      "spacing",
      "weight",
    ];
  }
}

customElements.define("dx-text", DomText);
