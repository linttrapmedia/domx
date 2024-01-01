import { Breakpoint, DomMQ } from "./dx-mq";
import {
  attachShadow,
  attachStyles,
  attachTemplate,
  cssObjectToString,
} from "./helpers";

class DomBox extends HTMLElement {
  baseStyles: string = `
  box-sizing: border-box;
  display: flex; 
  transition: padding 0.25s ease-in-out;`;
  styleSheet: CSSStyleSheet;
  template: Node;
  constructor() {
    super();
    attachShadow(this, { mode: "open" });
    this.styleSheet = attachStyles(this, "");
    this.template = attachTemplate(this, `<slot></slot>`);
    this.render = this.render.bind(this);
  }
  connectedCallback() {
    const bp = this.parentElement?.closest("dx-mq") as DomMQ;
    bp.subscribe(this);
    this.render(bp.calculateBreakpoint());
  }
  render(breakpoint: Breakpoint) {
    const styles = {};

    [
      "align-items",
      "border-color",
      "border-radius",
      "border-style",
      "border-width",
      "flex-direction",
      "flex-wrap",
      "flex-flow",
      "gap",
      "margin",
      "padding",
      "max-width",
    ].forEach((key) => {
      if (this.hasAttribute(key)) styles[key] = this.getAttribute(key);
      if (this.hasAttribute(`${breakpoint}:${key}`))
        styles[key] = this.getAttribute(`${breakpoint}:${key}`)!;
    });

    this.styleSheet.replace(`:host { 
      ${this.baseStyles}
      ${cssObjectToString(styles)}
    }`);

    if (this.hasAttribute("debug")) console.log(styles);
  }
}

customElements.define("dx-box", DomBox);

class DomCol extends DomBox {
  baseStyles: string = `
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: padding 0.25s ease-in-out;`;
}

customElements.define("dx-col", DomCol);

class DomRow extends DomBox {
  baseStyles: string = `
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  transition: padding 0.25s ease-in-out;`;
}

customElements.define("dx-row", DomRow);
