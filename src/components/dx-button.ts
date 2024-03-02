type Style = [
  bp: string,
  prop: string,
  val: string,
  psuedo?: string,
  subSelector?: string
];

export class DomxButton extends HTMLElement {
  baseStyles: Style[] = [
    ["0", "display", "inline-flex"],
    ["0", "align-items", "center"],
    ["0", "cursor", "pointer"],
    ["0", "justify-content", "center"],
    ["0", "width", "max-content"],
  ];
  behaviorAttributeNames: string[] = ["id", "oclick"];
  rendered: boolean = false;
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render = this.render.bind(this);
    this.shadowRoot!.innerHTML = "<slot></slot>";
    this.renderCss = this.renderCss.bind(this);
    this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
  }
  connectedCallback() {
    this.render();
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
    if (this.rendered) return;
    const buttonStyles: Style[] = this.getAttributeNames()
      .filter((attr) => !this.behaviorAttributeNames.includes(attr))
      .map((attributeName) => {
        const [attr, psuedo] = attributeName.split(":");
        const [prop, bp = "0"] = attr.split("--");
        const value = (this as any).getAttribute(attributeName);
        return [bp, prop, value, psuedo, undefined];
      });

    let buttonLabelStyles: Style[] = [];
    const buttonLabel = document.querySelector("dx-button-label");
    if (buttonLabel) {
      buttonLabelStyles = buttonLabel
        .getAttributeNames()
        .map((attributeName) => {
          const [attr, psuedo] = attributeName.split(":");
          const [prop, bp = "0"] = attr.split("--");
          const value = buttonLabel.getAttribute(attributeName) ?? "";
          return [bp, prop, value, psuedo, "dx-button-label"];
        });
    }

    this.styleSheet.replace(
      this.renderCss(this.baseStyles) +
        this.renderCss(buttonStyles) +
        this.renderCss(buttonLabelStyles)
    );
    this.dispatchEvent(new CustomEvent("rendered"));
    this.rendered = true;
  }
}

customElements.define("dx-button", DomxButton);

export class DomxButtonLabel extends HTMLElement {
  behaviorAttributeNames: string[] = [];
  rendered: boolean = false;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = "<slot></slot>";
  }
}

customElements.define("dx-button-label", DomxButtonLabel);
