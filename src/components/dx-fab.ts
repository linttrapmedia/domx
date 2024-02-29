export class DomxFAB extends HTMLElement {
  behaviorAttributeNames: string[] = [
    "container",
    "min-scroll-x",
    "max-scroll-x",
    "min-scroll-y",
    "max-scroll-y",
  ];
  baseStyles: string = `:host { box-sizing: border-box; display: flex; }`;
  container: Element | Window | null = null;
  minScrollX: number = 0;
  maxScrollX: number = 10000000000000000;
  minScrollY: number = 0;
  maxScrollY: number = 10000000000000000;
  psuedoStyles: Record<string, [string, string][]> = {};
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = "<slot></slot>";
    this.render = this.render.bind(this);
    this.renderCss = this.renderCss.bind(this);
    this.showHide = this.showHide.bind(this);
    this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") this.render();
      });
    });
    observer.observe(this, { attributes: true });
  }
  connectedCallback() {
    if (this.hasAttribute("container")) {
      this.container = document.querySelector(this.getAttribute("container")!);
    } else {
      this.container = window;
    }
    if (this.hasAttribute("min-scroll-x"))
      this.minScrollX = Number(this.getAttribute("min-scroll-x")!);
    if (this.hasAttribute("max-scroll-x"))
      this.maxScrollX = Number(this.getAttribute("max-scroll-x")!);
    if (this.hasAttribute("min-scroll-y"))
      this.minScrollY = Number(this.getAttribute("min-scroll-y")!);
    if (this.hasAttribute("max-scroll-y"))
      this.maxScrollY = Number(this.getAttribute("max-scroll-y")!);
    this.container?.addEventListener("scroll", this.showHide);
    this.render();
    this.showHide();
  }
  renderCss(attributes: string[]) {
    let styles: [bp: string, prop: string, val: string, psuedo: string][] = [
      ["0", "z-index", "1000", ""],
      ["0", "position", "fixed", ""],
      ["0", "bottom", "30px", ""],
      ["0", "right", "20px", ""],
    ];
    for (let i = 0; i < attributes.length; i++) {
      const attributeName = attributes[i];
      const [attr, psuedo] = attributeName.split(":");
      const [prop, bp = "0"] = attr.split("--");
      const value = (this as any).getAttribute(attributeName);
      styles.push([bp, prop, value, psuedo]);
    }
    const renderedStyles = styles
      .sort((a, b) => (a[3] ? 1 : -1)) // sort by psuedo
      .sort((a, b) => Number(a[0]) - Number(b[0])) // sort by breakpoint
      .map(
        ([bp, prop, val, psuedo]) =>
          `@media (min-width: ${bp}px) { :host${
            psuedo ? `(:${psuedo})` : ""
          } { ${prop}:${val}; }}`
      )
      .join("\n");
    return this.baseStyles + renderedStyles;
  }
  render() {
    const styleAttributes = this.getAttributeNames().filter(
      (attr) => !this.behaviorAttributeNames.includes(attr)
    );
    this.styleSheet.replace(this.renderCss(styleAttributes));
  }
  showHide() {
    if (this.container === null) return;
    if (this.container instanceof Window) {
      if (this.container.scrollY > this.minScrollY) {
        this.style.display = "block";
      } else {
        this.style.display = "none";
      }
    } else {
      if (
        this.container.scrollTop > this.minScrollY &&
        this.container.scrollTop < this.maxScrollY
      ) {
        this.style.display = "block";
      } else {
        this.style.display = "none";
      }
    }
  }
}

customElements.define("dx-fab", DomxFAB);
