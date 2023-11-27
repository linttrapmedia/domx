import * as dagre from "@dagrejs/dagre";

// Function to shorten the path near the target node
function shortenForArrow(edge, amount) {
  if (edge.points.length < 2) return "";

  const lastPoint = edge.points[edge.points.length - 1];
  const secondLastPoint = edge.points[edge.points.length - 2];

  const dx = lastPoint.x - secondLastPoint.x;
  const dy = lastPoint.y - secondLastPoint.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ratio = (len - amount) / len;

  const shortenedX = secondLastPoint.x + dx * ratio;
  const shortenedY = secondLastPoint.y + dy * ratio;

  const newPath = edge.points
    .slice(0, -1)
    .concat([{ x: shortenedX, y: shortenedY }]);
  return "M" + newPath.map((p) => `${p.x},${p.y}`).join("L");
}

// Function to calculate the total length of a path
function calculatePathLength(points) {
  let length = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
}

// Function to find the point at the halfway mark of the path
function findMidpoint(points, halfLength) {
  let lengthCovered = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);

    if (lengthCovered + segmentLength >= halfLength) {
      const ratio = (halfLength - lengthCovered) / segmentLength;
      return {
        x: points[i].x + ratio * dx,
        y: points[i].y + ratio * dy,
      };
    }
    lengthCovered += segmentLength;
  }
  return points[0]; // Fallback to the first point
}

class DomMachineDebugger extends HTMLElement {
  previousState: string = "";
  currentState: string = "";
  currentEvent: string = "";
  config: any;
  constructor() {
    super();
    this.init = this.init.bind(this);
    this.render = this.render.bind(this);
  }
  connectedCallback() {
    const src = this.getAttribute("src");
    if (!src) return;
    const sub = this.getAttribute("sub");
    if (sub) {
      const subEl = document.querySelector(sub) as DomMachine;
      if (subEl) {
        this.currentState = subEl.state;
        subEl.sub((state: string, event: string) => {
          this.previousState = this.currentState;
          this.currentState = state;
          this.currentEvent = event;
          this.render();
        });
      }
    }
    fetch(src).then((r) => r.json().then(this.init));
  }
  init(config: any) {
    this.config = config;
    this.render();
  }
  render() {
    if (!this.config) return;
    const { states, initialState } = this.config;
    var g = new dagre.graphlib.Graph();
    g.setGraph({
      marginx: 20,
      marginy: 20,
      nodesep: 20,
      edgesep: 100,
    });
    g.setDefaultEdgeLabel(() => ({}));

    // Add nodes and edges
    g.setNode(initialState, { label: initialState, width: 150, height: 50 });
    Object.entries(states).forEach(([state], i, _states) => {
      g.setNode(state, { label: state, width: 150, height: 50 });
      for (const action in states[state]) {
        const findStateAction = states[state][action].filter(
          (a) => a[0] === "state"
        )[0];
        if (!findStateAction) continue;
        const nextState = findStateAction[1];
        const id = `${state}-${action}-${nextState}`;
        g.setEdge(state, nextState, {
          label: action,
          id: id,
        });
      }
    });

    // Hydrate graph
    dagre.layout(g);

    let svgContent =
      '<svg width="' +
      g.graph().width +
      '" height="' +
      g.graph().height +
      '" xmlns="http://www.w3.org/2000/svg" style="border:1px solid black; font-family: monospace; border-radius:5px;">';

    // Define the arrowhead marker
    svgContent += `
  <defs>
  <marker id="arrowhead" markerWidth="10" markerHeight="8.66" 
    refX="0" refY="4.33" orient="auto">
      <polygon fill="grey" points="0 8.66, 10 4.33, 0 0" />
    </marker>
  </defs>`;

    // Render nodes
    g.nodes().forEach((v, i) => {
      let node = g.node(v);
      const strokeWidth = node.label === this.currentState ? 3 : 1;
      svgContent += `<rect rx="5" x="${node.x - node.width / 2}" y="${
        node.y - node.height / 2
      }" width="${node.width}" height="${
        node.height
      }" style="fill: white; stroke: black; stroke-width:${strokeWidth};"/>`;
      svgContent += `<text x="${node.x}" y="${node.y}" text-anchor="middle" alignment-baseline="central">${node.label}</text>`;
    });

    // Render edges
    g.edges().forEach((e, i) => {
      let edge = g.edge(e);
      let path = shortenForArrow(edge, 10); // Shorten by 10 units
      const color =
        edge.id ===
        `${this.previousState}-${this.currentEvent}-${this.currentState}`
          ? "black"
          : "grey";

      svgContent += `<path d="${path}" style="fill: none; stroke: ${color};" marker-end="url(#arrowhead)"/>`;

      // Calculate and add label for the edge
      const totalLength = calculatePathLength(edge.points);
      const midpoint = findMidpoint(edge.points, totalLength / 2);
      const labelText = edge.label;
      const fontSize = 12; // Adjust as needed
      const padding = 3; // Padding around the text
      const textWidth = labelText.length * (fontSize / 1.5); // Estimate text width
      const textHeight = fontSize; // Estimate text height

      // Add background rectangle for the label
      svgContent += `<rect rx="3" x="${
        midpoint.x - textWidth / 2 - padding
      }" y="${midpoint.y - textHeight / 2 - padding}" width="${
        textWidth + 2 * padding
      }" height="${textHeight + 2 * padding}" fill="${color}" />`;

      // Add text label
      svgContent += `<text fill="white" x="${midpoint.x}" y="${midpoint.y}" text-anchor="middle" alignment-baseline="middle" font-size="${fontSize}">${labelText}</text>`;
    });

    svgContent += "</svg>";
    this.innerHTML = svgContent;
  }
}

customElements.define("dom-machine-debugger", DomMachineDebugger);
