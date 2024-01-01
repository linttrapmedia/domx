import {
  attachShadow,
  attachStyles,
  attachTemplate,
  mergeByIndex,
} from "../helpers";

const styles = `
:host {
  font-size: var(--dx-text-size, 14px);
  font-family: var(--dx-text-font, Arial);
  color: var(--dx-text-color, #000);
}
:host img {
  transition: all 0.2s ease-in-out;
}
`;

const template = `<slot></slot>`;

class DomImg extends HTMLElement {
  preload: boolean = false;
  breakpoints: number[] = [0, 960, 1440];
  height: string[] = ["auto"];
  img: HTMLImageElement;
  "lazy-src": string;
  src: string;
  width: string[] = ["auto"];
  constructor() {
    super();
    attachShadow(this, { mode: "open" });
    attachStyles(this, styles);
    attachTemplate(this, template);
    this.render = this.render.bind(this);
    this.setupImageAndLazyLoading = this.setupImageAndLazyLoading.bind(this);
    this.setupPreloading = this.setupPreloading.bind(this);
    this.setupAttributes = this.setupAttributes.bind(this);
    this.connectedCallback = this.connectedCallback.bind(this);
  }
  connectedCallback() {
    this.setupAttributes()
      .setupPreloading()
      .setupImageAndLazyLoading()
      .render();
    window.addEventListener("resize", this.render);
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.render);
  }
  render() {
    const width = window.innerWidth;
    this.breakpoints.forEach((bp, i) => {
      if (width > bp) {
        if (this.height[i]) this.img.style.height = this.height[i];
        if (this.width[i]) this.img.style.width = this.width[i];
      }
    });
  }
  setupAttributes() {
    DomImg.observedAttributes.forEach((attr) => {
      const val = this.getAttribute(attr);
      if (!val) return;
      if (!Array.isArray(this[attr])) return (this[attr] = val);
      return (this[attr] = mergeByIndex(this[attr], val.split(",")));
    });
    return this;
  }
  setupImageAndLazyLoading() {
    const img = document.createElement("img");
    this.shadowRoot?.appendChild(img);
    this.img = img;
    if (this["lazy-src"]) {
      this.img.src = this["lazy-src"];
      let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let target = entry.target as HTMLImageElement;
            target.src = this.src;
            observer.unobserve(target);
          }
        });
      });
      observer.observe(img);
    } else {
      this.img.src = this.src;
    }
    return this;
  }
  setupPreloading() {
    if (this.getAttribute("preload") !== null) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = this.src;
      document.head.appendChild(link);
    }
    return this;
  }
  static get observedAttributes() {
    return ["height", "lazy-src", "preload", "src", "width"];
  }
}

customElements.define("dx-img", DomImg);
