(() => {
  class DomChart extends HTMLElement {
    constructor() {
      super();
      this.init = this.init.bind(this);
      this.render = this.render.bind(this);
    }
    connectedCallback() {
      const src = this.getAttribute("src");
      if (!src)
        return;
      fetch(src).then((r) => r.json().then(this.init));
    }
    init(config) {
      this.config = config;
      console.log(config);
      this.render();
    }
    render() {
      const { states, initialState } = this.config;
      const svgElem = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgElem.setAttribute("width", "500");
      svgElem.setAttribute("height", "500");
      let x = 10, y = 10;
      const boxWidth = 100, boxHeight = 50, margin = 10;
      Object.entries(states).forEach(([k, v]) => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("transform", `translate(${x}, ${y})`);
        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("width", boxWidth.toString());
        rect.setAttribute("height", boxHeight.toString());
        rect.setAttribute("fill", "white");
        rect.setAttribute("stroke", "black");
        rect.setAttribute("stroke-width", "1");
        rect.setAttribute("rx", "5");
        rect.setAttribute("ry", "5");
        rect.style.cursor = "pointer";
        if (k === initialState)
          rect.setAttribute("stroke-width", "3");
        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", (boxWidth / 2).toString());
        text.setAttribute("y", (boxHeight / 2).toString());
        text.setAttribute("alignment-baseline", "middle");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "12");
        text.setAttribute("font-family", "sans-serif");
        text.style.pointerEvents = "none";
        text.textContent = k;
        g.appendChild(rect);
        g.appendChild(text);
        svgElem.appendChild(g);
        x += boxWidth + margin;
        if (x + boxWidth > 800) {
          x = 10;
          y += boxHeight + margin;
        }
      });
      this.appendChild(svgElem);
    }
  }
  customElements.define("dom-chart", DomChart);
})();
