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
      const mermaidSrc = this.getAttribute("mermaid");
      if (!mermaidSrc)
        return;
      const script = document.createElement("script");
      script.src = mermaidSrc;
      script.onload = () => fetch(src).then((r) => r.json().then(this.init));
      document.head.appendChild(script);
    }
    init(config) {
      this.config = config;
      this.render();
    }
    render() {
      globalThis.mermaid.initialize({
        startOnLoad: false,
        boxMargin: 100,
        theme: "neutral"
      });
      const { states, initialState } = this.config;
      const mermaid = document.createElement("div");
      mermaid.className = "mermaid";
      this.appendChild(mermaid);
      let graph = "";
      graph += `flowchart LR
`;
      graph += `${initialState}[${initialState}]
`;
      for (const state in states) {
        graph += `${state}[${state}]
`;
        for (const event in states[state]) {
          for (const transformation of states[state][event]) {
            const [dx, key] = transformation;
            if (dx === "state") {
              graph += `${state} -- ${event} --> ${key}
`;
            }
          }
        }
      }
      graph += `classDef node font-size:10pt,font-weight:bold,fill:#fff,stroke:#333,stroke-width:1px,rx:4px,ry:4px,padding:10pt;
`;
      graph += `classDef edgeLabel color:#999,font-size:10pt,font-weight:bold,fill:#fff,stroke:#999,stroke-width:1px,rx:4px,ry:4px,padding:5pt;
`;
      mermaid.textContent = graph;
      globalThis.mermaid.init(void 0, mermaid);
    }
  }
  customElements.define("dom-chart", DomChart);
})();
