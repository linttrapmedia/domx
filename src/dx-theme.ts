import { attachShadow, attachStyles, attachTemplate } from "./helpers";

const lite = `
--dx-theme-primary-color: #6a8efa;
--dx-theme-secondary-color: #6efa8e;
--dx-theme-tertiary-color: #fa6a6a;
--dx-theme-info-color: #6afafa;
--dx-theme-success-color: #6efa8e;
--dx-theme-warning-color: #faf46a;
--dx-theme-danger-color: #fa6a6a;
--dx-theme-text-color: #333333;
--dx-theme-bg-color: #ffffff;
--dx-theme-color-black: #333333;
--dx-theme-color-white: #ffffff;
`;

const dark = `
--dx-theme-primary-color: #3a3fda;
--dx-theme-secondary-color: #3dda4e;
--dx-theme-tertiary-color: #da3a3a;
--dx-theme-info-color: #3adada;
--dx-theme-success-color: #3dda4e;
--dx-theme-warning-color: #dad53a;
--dx-theme-danger-color: #da3a3a;
--dx-theme-text-color: #ffffff;
--dx-theme-bg-color: #333333;
--dx-theme-color-black: #ffffff;
--dx-theme-color-white: #333333;
`;

const elegant = `
--dx-theme-font-primary: "Playfair Display", Georgia, serif; 
--dx-theme-font-secondary: "Lato", "Helvetica Neue", Helvetica, Arial, sans-serif; 
--dx-theme-font-tertiary: "Roboto Slab", Times, serif; 
--dx-theme-font-size-small: 14px; 
--dx-theme-font-size-medium: 18px; 
--dx-theme-font-size-large: 24px; 
--dx-theme-font-size-xlarge: 30px; 
`;

const modern = `
--dx-theme-font-primary: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif; 
--dx-theme-font-secondary: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif; 
--dx-theme-font-tertiary: "Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif; 
--dx-theme-font-size-small: 12px; 
--dx-theme-font-size-medium: 16px; 
--dx-theme-font-size-large: 20px; 
--dx-theme-font-size-xlarge: 26px; 
`;

class DomTheme extends HTMLElement {
  colorScheme: "dark" | "lite" = "lite";
  fontScheme: "elegant" | "modern" = "elegant";
  styleSheet: CSSStyleSheet;
  constructor() {
    super();
    attachShadow(this, { mode: "open" });
    attachTemplate(this, `<slot></slot>`);
    this.render = this.render.bind(this);
    this.setupStyleSheet();
  }
  attributeChangedCallback() {
    this.colorScheme = this.hasAttribute("dark") ? "dark" : "lite";
    this.fontScheme = this.hasAttribute("app") ? "modern" : "elegant";
    this.render();
  }
  connectedCallback() {
    this.colorScheme = this.hasAttribute("dark") ? "dark" : "lite";
    this.fontScheme = this.hasAttribute("modern") ? "modern" : "elegant";
    this.render();
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.render);
  }
  render() {
    const colors = this.colorScheme === "dark" ? dark : lite;
    const fonts = this.fontScheme === "modern" ? modern : elegant;

    this.styleSheet.replace(`:host { 
      ${colors} 
      ${fonts} 
      display:block;
      background-color: var(--dx-theme-bg-color);
      height: 100%;
      width: 100%;}`);
  }
  setupStyleSheet() {
    this.styleSheet = attachStyles(this, `:host { }`);
  }
  static get observedAttributes() {
    return ["dark", "lite", "app", "blog"];
  }
}

customElements.define("dx-theme", DomTheme);
