import { DomxBase, DxStyle } from "./dx-base";

export class DomxButton extends DomxBase {
  baseStyles: DxStyle[] = [
    ["0", "display", "inline-flex"],
    ["0", "align-items", "center"],
    ["0", "cursor", "pointer"],
    ["0", "justify-content", "center"],
    ["0", "width", "max-content"],
  ];
  props: string[] = ["id", "oclick"];
  constructor() {
    super();
    this.registerEvents = this.registerEvents.bind(this);
  }
  registerEvents() {
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
    if (this.rendered) return;
    this.registerEvents();
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
  }
}

customElements.define("dx-button", DomxButton);

export class DomxButtonLabel extends DomxBase {
  constructor() {
    super();
  }
}
customElements.define("dx-button-label", DomxButtonLabel);
