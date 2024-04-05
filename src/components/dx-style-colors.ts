class DomxStyleColors extends HTMLElement {
  private styleSheet: CSSStyleSheet = new CSSStyleSheet();
  static create() {
    document.createElement("dx-style-colors") as DomxStyleColors;
  }
  static read(id: string) {
    return DomxStyleColors.instances.find((el) => el.id === id);
  }
  static update(id: string, props: any) {
    for (const key in props) DomxStyleColors.read(id)!.setAttribute(key, props[key]);
  }
  static delete(el: DomxStyleColors) {
    el.remove();
  }
  static list(filter: string | undefined = undefined) {
    if (!filter) return DomxStyleColors.instances;
    return DomxStyleColors.instances.filter((el) => el.matches(filter));
  }
  static instances: DomxStyleColors[] = [];
  props: string[] = ["id"];
  constructor() {
    super();
    this.render = this.render.bind(this);
  }
  connectedCallback() {
    if (this.hasChildNodes()) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot!.innerHTML = "<slot></slot>";
      this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
    } else {
      document.adoptedStyleSheets = [this.styleSheet];
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") this.render();
      });
    });
    observer.observe(this, { attributes: true });
    DomxStyleColors.instances.push(this);
    this.render();
  }
  render() {
    const colorAttrs = this.getAttributeNames().filter((attr) => !this.props.includes(attr));
    const wrapSelector = (sel: string) => (this.hasChildNodes() ? `::slotted(${sel})` : sel);
    let styles = ``;
    for (const colorAttr of colorAttrs) {
      const colorVal = this.getAttribute(colorAttr) || "";
      const colorVar = `dx-style-color-${colorAttr}`;
      styles += `${this.hasChildNodes() ? ":host" : ":root"} { --${colorVar}:${colorVal}; }\n`; // needed for local scope
      styles += `${wrapSelector(`.txt-${colorAttr}`)} { color: var(--${colorVar}); }\n`;
      styles += `${wrapSelector(`.txt-${colorAttr}\\:hover:hover`)}  { color: var(--${colorVar}); }\n`;
      styles += `${wrapSelector(`.bg-${colorAttr}`)}  { background-color: var(--${colorVar}); }\n`;
      styles += `${wrapSelector(`.bg-${colorAttr}\\:hover:hover`)}  { background-color: var(--${colorVar}); }\n`;
    }
    this.styleSheet.replaceSync(styles);
  }
}

customElements.define("dx-style-colors", DomxStyleColors);

const win = window as any;
if (!win.DX) win.DX = {};
if (!win.DX.style) win.DX.style = {};
win.DX.style.colors = DomxStyleColors;
