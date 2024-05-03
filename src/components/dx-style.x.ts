class DomxStyleX extends HTMLElement {
  private styleSheet: CSSStyleSheet = new CSSStyleSheet();
  static create() {
    document.createElement("dx-style-colors") as DomxStyle;
  }
  static read(id: string) {
    return DomxStyle.instances.find((el) => el.id === id);
  }
  static update(id: string, props: any) {
    for (const key in props) DomxStyle.read(id)!.setAttribute(key, props[key]);
  }
  static delete(el: DomxStyle) {
    el.remove();
  }
  static list(filter: string | undefined = undefined) {
    if (!filter) return DomxStyle.instances;
    return DomxStyle.instances.filter((el) => el.matches(filter));
  }
  static instances: DomxStyle[] = [];
  constructor() {
    super();
    this.render = this.render.bind(this);
    this.reduceAttrs = this.reduceAttrs.bind(this);
    this.generateSelector = this.generateSelector.bind(this);
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
    DomxStyle.instances.push(this);
    this.render();
  }
  generateSelector(arrays: string[][]) {
    const combinations: string[] = [];

    // Function to recursively generate combinations
    function recurse(prefix: string, index: number) {
      if (index < arrays.length) {
        for (const item of arrays[index]) {
          const newPrefix = prefix ? `${prefix}\\:${item}` : item;
          combinations.push(newPrefix);
          recurse(newPrefix, index + 1);
        }
      }
    }

    // Generate combinations for each array
    for (let i = 0; i < arrays.length; i++) {
      recurse("", i);
    }

    return combinations;
  }
  reduceAttrs(prefix: string) {
    const attrs = this.getAttributeNames().filter((attr) => attr.startsWith(prefix));
    return attrs.reduce((acc, attr) => {
      const mod = attr.replace(prefix, "");
      acc[mod] = this.getAttribute(attr);
      return acc;
    }, {} as any);
  }
  render() {
    let styles = ``;
    const wrapSelector = (sel: string) => (this.hasChildNodes() ? `::slotted(${sel})` : sel);
    const colorAttrs = this.reduceAttrs("color-");
    const breakpointAttrs = this.reduceAttrs("breakpoint-");
    const psuedoAttrs = this.reduceAttrs("psuedo-");
    const modifiers = this.generateSelector([Object.keys(breakpointAttrs), Object.keys(psuedoAttrs)]);

    // colors
    for (const colorAttr in colorAttrs) {
      const colorVal = colorAttrs[colorAttr];
      const colorVar = `dx-style-color-${colorAttr}`;
      styles += `${this.hasChildNodes() ? ":host" : ":root"} { --${colorVar}:${colorVal}; }\n`; // needed for local scope
      styles += `${wrapSelector(`.txt-${colorAttr}`)} { color: var(--${colorVar}); }\n`;
      styles += `${wrapSelector(`.hover\\:txt-${colorAttr}:hover`)}  { color: var(--${colorVar}); }\n`;
      styles += `${wrapSelector(`.bg-${colorAttr}`)}  { background-color: var(--${colorVar}); }\n`;
      styles += `${wrapSelector(`.hover\\:bg-${colorAttr}:hover`)}  { background-color: var(--${colorVar}); }\n`;
    }

    // padding

    // replace styles
    console.log(styles);
    this.styleSheet.replaceSync(styles);
  }
}

customElements.define("dx-style", DomxStyle);

const win = window as any;
if (!win.DX) win.DX = {};
if (!win.DX.style) win.DX.style = {};
win.DX.style = DomxStyle;
