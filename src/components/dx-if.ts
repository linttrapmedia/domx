import { DomxState } from "./dx-state";

export class DomxIf extends HTMLElement {
  state: string = "";
  is: string = "";
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = "<slot></slot>";
  }
  connectedCallback() {
    const state = this.getAttribute("state");
    const is = this.getAttribute("is");
    if (!state || !is) return;
    (document.querySelector(state) as DomxState).sub((state: string) => {
      this.style.display = state === is ? "inherit" : "none";
    });
  }
}

customElements.define("dx-if", DomxIf);
