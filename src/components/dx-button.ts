import { DomxBase, DxStyle } from "./dx-base";

export class DomxButton extends DomxBase {
  baseStyles: DxStyle[] = [
    ["0", "align-items", "center"],
    ["0", "background-color", "black"],
    ["0", "background-color", "white", "hover"],
    ["0", "border", "1px solid white"],
    ["0", "color", "white"],
    ["0", "color", "black", "hover"],
    ["0", "cursor", "pointer"],
    ["0", "display", "inline-flex"],
    ["0", "justify-content", "center"],
    ["0", "padding", "0.5rem 1rem"],
    ["0", "width", "max-content"],
  ];
  props: string[] = ["id", "oclick"];
  constructor() {
    super();
    this.registerEvents = this.registerEvents.bind(this);
  }
  async registerEvents() {
    const DxStateOnClicks = this.getAttributeNames().filter((attr) => attr.startsWith("onclick:"));
    DxStateOnClicks.forEach((attr) => {
      const value = this.getAttribute(attr) ?? "";
      this.addEventListener("click", () => {
        const [_, state] = attr.split(":");
        const transformation = value.split(",");
        const stateEl = document.querySelector(`dx-state[name=${state}]`) as any;
        const [trait] = transformation;
        stateEl.transform(trait, transformation);
      });
    });
  }
  async render() {
    const baseStyles = this.renderCss(this.baseStyles);
    const buttonStyles = this.renderCss(this.getStylesFromEl(this));
    const buttonLabel = this.querySelector("dx-button-label") as DomxButtonLabel;
    let buttonLabelStyles = "";
    if (buttonLabel) {
      await customElements.whenDefined("dx-button-label");
      const buttonLabelStyleList = [...this.getStylesFromEl(buttonLabel)];
      buttonLabelStyles = this.renderCss(buttonLabelStyleList);
    }
    this.styleSheet.replace(baseStyles + buttonStyles + buttonLabelStyles);
    await this.registerEvents();
  }
}

customElements.define("dx-button", DomxButton);

export class DomxButtonLabel extends DomxBase {
  constructor() {
    super();
  }
}
customElements.define("dx-button-label", DomxButtonLabel);
