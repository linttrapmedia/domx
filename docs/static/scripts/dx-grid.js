"use strict";(()=>{var h=class extends HTMLElement{constructor(){super();this.baseStyles=[["box-sizing","border-box"],["display","grid"]];this.psuedoStyles={};this.styleSheet=new CSSStyleSheet;this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML="<slot></slot>",this.render=this.render.bind(this),this.shadowRoot.adoptedStyleSheets=[this.styleSheet],new MutationObserver(e=>{e.forEach(o=>{o.type==="attributes"&&this.render()})}).observe(this,{attributes:!0})}connectedCallback(){this.render(),window.addEventListener("resize",this.render)}disconnectedCallback(){window.removeEventListener("resize",this.render)}render(){let i=this.baseStyles,e={};this.getAttributeNames().forEach(t=>{let[r,d]=t.split("--"),[n,s]=r.split(":"),c=Number(d??0);if(window.innerWidth<c)return;let l=this.getAttribute(t);s?(e[s]||(e[s]=[]),e[s].push([n,l])):i.push([n,l])});let o=`:host{ ${i.map(([t,r])=>`${t}:${r};`).join("")}}`,a=Object.entries(e).map(([t,r])=>{let d=r.map(([n,s])=>`${n}:${s};`).join("");return`:host(:${t}) { ${d} }`}).join("");this.styleSheet.replace(o+a)}};customElements.define("dx-grid",h);})();
//# sourceMappingURL=dx-grid.js.map