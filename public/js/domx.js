(() => {
  class Domx extends HTMLElement {
    constructor() {
      super();
      this.init = this.init.bind(this);
      this.handleEvent = this.handleEvent.bind(this);
      this.transform = this.transform.bind(this);
      this.transformClick = this.transformClick.bind(this);
    }
    connectedCallback() {
      const src = this.getAttribute("src");
      if (!src)
        return;
      fetch(src).then((r) => r.json().then(this.init));
    }
    handleEvent(event) {
      console.log(event);
    }
    init(config) {
      this.config = config;
      const initState = config.states[config.initialState];
      if (initState.entry)
        this.transform(initState.entry);
    }
    transform(transformations) {
      for (let i = 0; i < transformations.length; i++) {
        const [trait] = transformations[i];
        switch (trait) {
          case "click":
            this.transformClick(transformations[i]);
            break;
        }
      }
    }
    transformClick(transformation) {
      const [, selector, event] = transformation;
      const el = document.querySelector(selector);
      console.log(selector, el, event);
    }
  }
  customElements.define("dom-x", Domx);
})();
