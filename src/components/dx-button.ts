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
  }
  render() {
    if (this.rendered) return;

    const onclick = this.getAttribute("onclick") ?? "";
    const isDxStateOnClick = !onclick.startsWith("javascript");
    if (isDxStateOnClick) {
      this.removeAttribute("onclick");
      this.addEventListener("click", () => {
        const [stateName, transformations] = onclick.split(":");
        const state = document.querySelector(
          `dx-state[name=${stateName}]`
        ) as any;
        const txs = transformations.split("|").map((tx) => tx.split(","));
        txs.forEach((tx) => {
          const [func, ...args] = tx;
          switch (func) {
            case "dispatch":
              state.dispatch(...args);
              break;
            case "transform":
              const [evt, ...rest] = args;
              state.transform();
              break;
          }
        });
      });
    }

    const buttonStyles = this.renderCss(this.getStylesFromEl(this));
    const buttonLabel = document.querySelector("dx-button-label");
    const buttonLabelStyleList = this.getStylesFromEl(
      buttonLabel as HTMLButtonElement,
      "dx-button-label"
    );
    const buttonLabelStyles = this.renderCss(buttonLabelStyleList);
    console.log(buttonLabelStyles);
    this.styleSheet.replace(buttonStyles + buttonLabelStyles);
  }
}

customElements.define("dx-button", DomxButton);

export class DomxButtonLabel extends DomxBase {
  constructor() {
    super();
  }
}
customElements.define("dx-button-label", DomxButtonLabel);
