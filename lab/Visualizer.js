(() => {
  class WebStateChart extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const src = this.getAttribute("src");
      if (!src)
        return;
      fetch(src).then((resp) => resp.text()).then((xml) => {
        const xmldoc = new DOMParser().parseFromString(xml, "text/xml");
        const scxml = xmldoc.children[0];
        for (let i = 0; i < scxml.children.length; i++) {
          console.log(i, scxml.children[i]);
        }
      });
    }
  }
  customElements.define("wsc-visualizer", WebStateChart);
})();
