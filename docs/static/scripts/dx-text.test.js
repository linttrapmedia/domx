"use strict";(()=>{var h=class extends HTMLElement{constructor(){super();this.baseStyles=[];this.psuedoStyles={};this.styleSheet=document.createElement("style");this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML="<slot></slot>",this.render=this.render.bind(this),this.shadowRoot.appendChild(this.styleSheet),new MutationObserver(e=>{e.forEach(d=>{d.type==="attributes"&&this.render()})}).observe(this,{attributes:!0})}connectedCallback(){this.render(),window.addEventListener("resize",this.render)}disconnectedCallback(){window.removeEventListener("resize",this.render)}render(){let o=this.baseStyles,e={};this.getAttributeNames().forEach(s=>{let[r,n]=s.split(":"),[i,l]=r.split("--"),u=Number(l??0);if(window.innerWidth<u)return;let a=this.getAttribute(s);n?(e[n]||(e[n]=[]),e[n].push([i,a])):o.push([i,a])});let d=`:host{ ${o.map(([s,r])=>`${s}:${r};`).join("")}}`,p=Object.entries(e).map(([s,r])=>{let n=r.map(([i,l])=>`${i}:${l};`).join("");return`:host(:${s}) { ${n} }`}).join("");this.styleSheet.textContent="",this.styleSheet.textContent=d+p}};customElements.define("dx-text",h);var y=()=>{let t=document.createElement("dx-text");t.setAttribute("font-size","12px"),t.innerHTML="<div>test</div>";let c='<dx-text font-size="12px"><div>test</div></dx-text>',o=t.outerHTML===c;return console.log("computed",t.outerHTML,t.style),{pass:o}};})();
//# sourceMappingURL=dx-text.test.js.map