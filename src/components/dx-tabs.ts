type Style = [
  bp: string,
  prop: string,
  val: string,
  psuedo?: string,
  subSelector?: string
];

export class DomxTabs extends HTMLElement {
  behaviorAttributeNames: string[] = ["value"];
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = "<slot></slot>";
    this.render = this.render.bind(this);
    this.renderCss = this.renderCss.bind(this);
    this.setActiveTab = this.setActiveTab.bind(this);
    this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
  }
  connectedCallback() {
    this.render();
  }
  renderCss() {
    return `:host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      width: 100%;
    }`;
  }
  render() {
    this.styleSheet.replace(this.renderCss());
    this.dispatchEvent(new CustomEvent("rendered"));
    this.setActiveTab(this.getAttribute("value") || "");
  }
  setActiveTab(value: string) {
    const buttons = this.querySelectorAll("dx-tab-button");
    buttons.forEach((button) => button.classList.remove("active"));
    const panels = this?.querySelectorAll("dx-tab-panel");
    panels.forEach((panel) => panel.classList.remove("active"));
    const button = this.querySelector(`dx-tab-button[value="${value}"]`);
    if (button) button.classList.add("active");
    const panel = this.querySelector(`dx-tab-panel[value="${value}"]`);
    if (panel) panel.classList.add("active");
    this.setAttribute("value", value);
  }
}

customElements.define("dx-tabs", DomxTabs);

export class DomxTabButtons extends HTMLElement {
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = "<slot></slot>";
    this.render = this.render.bind(this);
    this.renderCss = this.renderCss.bind(this);
    this.renderBaseCss = this.renderBaseCss.bind(this);
    this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
  }
  connectedCallback() {
    this.render();
  }
  renderBaseCss() {
    const parent = this.closest("dx-tabs");
    const accentColor = parent
      ? parent.getAttribute("accent-color")
      : "rgba(255,255,255,0.5)";
    return `:host {
      box-sizing: border-box;
      border-bottom: 3px solid ${accentColor};
      display: flex;
      flex-direction: row;
    }`;
  }
  renderCss(styles: Style[]) {
    const renderedStyles = styles
      .sort((a) => (a[3] ? 1 : -1)) // sort by psuedo
      .sort((a, b) => Number(a[0]) - Number(b[0])) // sort by breakpoint
      .map(([bp, prop, val, psuedo, subSelector = null]) => {
        return `@media (min-width: ${bp}px) { :host${
          psuedo
            ? `(:${psuedo}) ${
                subSelector !== null ? `::slotted(${subSelector})` : ""
              }`
            : ` ${subSelector !== null ? `::slotted(${subSelector})` : ""}`
        } { ${prop}:${val}; }}`;
      })
      .join("\n");
    return renderedStyles;
  }
  render() {
    const styles: Style[] = this.getAttributeNames().map((attributeName) => {
      const [attr, psuedo] = attributeName.split(":");
      const [prop, bp = "0"] = attr.split("--");
      const value = (this as any).getAttribute(attributeName);
      return [bp, prop, value, psuedo, undefined];
    });

    this.styleSheet.replace(this.renderBaseCss() + this.renderCss(styles));
    this.dispatchEvent(new CustomEvent("rendered"));
  }
}

customElements.define("dx-tab-buttons", DomxTabButtons);

export class DomxTabButton extends HTMLElement {
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = "<slot></slot>";
    this.render = this.render.bind(this);
    this.renderBaseCss = this.renderBaseCss.bind(this);
    this.renderCss = this.renderCss.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
    this.addEventListener("click", this.handleClick);
  }
  connectedCallback() {
    this.render();
  }
  handleClick() {
    const parent = this.closest("dx-tabs") as DomxTabs;
    if (parent) parent.setActiveTab(this.getAttribute("value") || "");
  }
  renderBaseCss() {
    const parent = this.closest("dx-tabs");
    const bgColor = parent ? parent.getAttribute("bg-color") : "#fff";
    const bgColorHover = parent
      ? parent.getAttribute("bg-color:hover")
      : "#f0f0f0";
    const fgColor = parent ? parent.getAttribute("fg-color") : "#000";
    const fgColorHover = parent
      ? parent.getAttribute("fg-color:hover")
      : "#000";
    const accentColor = parent
      ? parent.getAttribute("accent-color")
      : "rgba(255,255,255,0.5)";
    const accentColorHover = parent
      ? parent.getAttribute("accent-color:hover")
      : "rgba(255,255,255,0.5)";
    return `:host {
      background-color: ${bgColor};
      box-sizing: border-box;
      color: ${fgColor};
      cursor: pointer;
      border-bottom: 3px solid ${accentColor};
      display: flex;
      flex-direction: row;
      padding:1em;
      margin-bottom: -3px;
    }
    :host(:hover) {
      background-color: ${bgColorHover};
      color: ${fgColorHover};
    }
    
    :host(.active) {
      background-color: ${bgColorHover};
      color: ${fgColorHover};
      border-bottom: 3px solid ${accentColorHover};
    }
    `;
  }
  renderCss(styles: Style[]) {
    const renderedStyles = styles
      .sort((a) => (a[3] ? 1 : -1)) // sort by psuedo
      .sort((a, b) => Number(a[0]) - Number(b[0])) // sort by breakpoint
      .map(([bp, prop, val, psuedo, subSelector = null]) => {
        return `@media (min-width: ${bp}px) { :host${
          psuedo
            ? `(:${psuedo}) ${
                subSelector !== null ? `::slotted(${subSelector})` : ""
              }`
            : ` ${subSelector !== null ? `::slotted(${subSelector})` : ""}`
        } { ${prop}:${val}; }}`;
      })
      .join("\n");
    return renderedStyles;
  }
  render() {
    this.classList.add("tab-button");
    const styles: Style[] = this.getAttributeNames().map((attributeName) => {
      const [attr, psuedo] = attributeName.split(":");
      const [prop, bp = "0"] = attr.split("--");
      const value = (this as any).getAttribute(attributeName);
      return [bp, prop, value, psuedo, undefined];
    });
    this.styleSheet.replace(this.renderBaseCss() + this.renderCss(styles));
    this.dispatchEvent(new CustomEvent("rendered"));
  }
}

customElements.define("dx-tab-button", DomxTabButton);

export class DomxTabPanels extends HTMLElement {
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = "<slot></slot>";
    this.render = this.render.bind(this);
    this.renderCss = this.renderCss.bind(this);
    this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
  }
  connectedCallback() {
    this.render();
  }
  renderCss() {
    return `:host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      position: relative;
    }`;
  }
  render() {
    this.styleSheet.replace(this.renderCss());
    this.dispatchEvent(new CustomEvent("rendered"));
  }
}

customElements.define("dx-tab-panels", DomxTabPanels);

export class DomxTabPanel extends HTMLElement {
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = "<slot></slot>";
    this.render = this.render.bind(this);
    this.renderCss = this.renderCss.bind(this);
    this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
  }
  connectedCallback() {
    this.render();
  }
  renderCss() {
    return `:host {
      box-sizing: border-box;
      position: absolute;
      display: none;
    }
    :host(.active) {
      display: block;
      position: static;
    }
    `;
  }
  render() {
    this.styleSheet.replace(this.renderCss());
    this.dispatchEvent(new CustomEvent("rendered"));
  }
}

customElements.define("dx-tab-panel", DomxTabPanel);
