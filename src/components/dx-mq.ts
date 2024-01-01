import { attachShadow, attachStyles, attachTemplate } from "../helpers";

export type Breakpoint = "sm" | "md" | "lg" | "xl" | "xxl";

export class DomMQ extends HTMLElement {
  subscribers: any[] = [];
  template: Node;
  constructor() {
    super();
    attachShadow(this, { mode: "open" });
    attachStyles(this, `:host { display:block; width:100%; height: 100%; }`);
    this.calculateBreakpoint = this.calculateBreakpoint.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.update = this.update.bind(this);
    this.template = attachTemplate(this, `<slot></slot>`);
  }
  calculateBreakpoint() {
    const width = window.innerWidth;
    let bp: Breakpoint = "sm";
    const sm = Number(this.getAttribute("sm") ?? "0");
    const md = Number(this.getAttribute("md") ?? "640");
    const lg = Number(this.getAttribute("lg") ?? "1024");
    const xl = Number(this.getAttribute("xl") ?? "1280");
    const xxl = Number(this.getAttribute("xxl") ?? "1536");
    if (width > 0) bp = "sm";
    if (width >= sm) bp = "sm";
    if (width >= md) bp = "md";
    if (width >= lg) bp = "lg";
    if (width >= xl) bp = "xl";
    if (width >= xxl) bp = "xxl";
    return bp;
  }
  connectedCallback() {
    this.update();
    window.addEventListener("resize", this.update);
  }
  subscribe(node: Node) {
    this.subscribers.push(node);
  }
  update() {
    for (let i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i].render(this.calculateBreakpoint());
    }
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.update);
  }
  static get observedAttributes() {
    return ["sm", "md", "lg", "xl", "xxl"];
  }
}

customElements.define("dx-mq", DomMQ);
