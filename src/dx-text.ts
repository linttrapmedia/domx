import {
  attachShadow,
  attachStyles,
  attachTemplate,
  mergeByIndex,
} from "./helpers";

const baseStyles = `
  font-size: var(--dx-text-size, var(--dx-theme-font-size-medium, 16px));
  color: var(--dx-theme-text-color);
`;

const fontFamilyMap = {
  primary: "var(--dx-text-font, var(--dx-theme-font-primary, Arial))",
  secondary: "var(--dx-text-font, var(--dx-theme-font-secondary, Arial))",
  tertiary: "var(--dx-text-font, var(--dx-theme-font-tertiery, Arial))",
};

const colorMap = {
  black: "var(--dx-text-color-black, var(--dx-theme-color-black, black))",
  danger: "var(--dx-text-color-danger, var(--dx-theme-danger-color, red))",
  info: "var(--dx-text-color-info, var(--dx-theme-info-color, blue))",
  primary: "var(--dx-text-color-primary, var(--dx-theme-primary-color, blue))",
  secondary:
    "var(--dx-text-color-secondary, var(--dx-theme-secondary-color, green))",
  success: "var(--dx-text-color-success, var(--dx-theme-success-color, green))",
  tertiary:
    "var(--dx-text-color-tertiary, var(--dx-theme-tertiary-color, red))",
  warning:
    "var(--dx-text-color-warning, var(--dx-theme-warning-color, yellow))",
  white: "var(--dx-text-color-white, var(--dx-theme-color-white, white))",
};

const template = `<slot></slot>`;

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
  styleSheet: CSSStyleSheet;
  constructor() {
    super();
    attachShadow(this, { mode: "open" });
    attachTemplate(this, template);
    this.render = this.render.bind(this);
    this.setupAttributes = this.setupAttributes.bind(this);
    this.setupStyleSheet = this.setupStyleSheet.bind(this);
  }
  connectedCallback() {
    this.setupAttributes().setupStyleSheet().render();
    window.addEventListener("resize", this.render);
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.render);
  }
  render() {
    const width = window.innerWidth;
    let styles = "";
    this.breakpoints.forEach((bp, i) => {
      if (width > bp) {
        if (this.align[i]) styles += `text-align: ${this.align[i]};`;
        if (this.color[i]) styles += `color: ${colorMap[this.color[i]]};`;
        if (this.font[i])
          styles += `font-family: ${fontFamilyMap[this.font[i]]};`;
        if (this.oblique[i])
          styles += `font-style: ${
            this.oblique[i] === "true" ? "oblique" : "normal"
          }`;
        if (this.opacity[i]) styles += `opacity: ${this.opacity[i]};`;
        if (this.shadow[i]) styles += `text-shadow: ${this.shadow[i]};`;
        if (this.size[i]) styles += `font-size: ${this.size[i]};`;
        if (this.spacing[i]) styles += `letter-spacing: ${this.spacing[i]};`;
        if (this.weight[i]) styles += `font-weight: ${this.weight[i]};`;
      }
      this.styleSheet.replace(`:host {  ${baseStyles} ${styles} }`);
    });
  }
  setupAttributes() {
    DomText.observedAttributes.forEach((attr) => {
      const val = this.getAttribute(attr);
      if (!val) return;
      this[attr] = mergeByIndex(this[attr], val.split(","));
    });
    return this;
  }
  static get observedAttributes() {
    return [
      "align",
      "breakpoints",
      "color",
      "font",
      "oblique",
      "opacity",
      "shadow",
      "size",
      "spacing",
      "weight",
    ];
  }
  setupStyleSheet() {
    this.styleSheet = attachStyles(this, `:host { ${baseStyles} } `);
    return this;
  }
}

customElements.define("dx-text", DomText);
