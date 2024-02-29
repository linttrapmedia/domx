"use strict";(()=>{var o=class extends HTMLElement{constructor(){super();this.behaviorAttributeNames=["container","min-scroll-x","max-scroll-x","min-scroll-y","max-scroll-y"];this.baseStyles=":host { box-sizing: border-box; display: flex; }";this.container=null;this.minScrollX=0;this.maxScrollX=1e16;this.minScrollY=0;this.maxScrollY=1e16;this.psuedoStyles={};this.styleSheet=new CSSStyleSheet;this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML="<slot></slot>",this.render=this.render.bind(this),this.renderCss=this.renderCss.bind(this),this.showHide=this.showHide.bind(this),this.shadowRoot.adoptedStyleSheets=[this.styleSheet],new MutationObserver(s=>{s.forEach(n=>{n.type==="attributes"&&this.render()})}).observe(this,{attributes:!0})}connectedCallback(){this.hasAttribute("container")?this.container=document.querySelector(this.getAttribute("container")):this.container=window,this.hasAttribute("min-scroll-x")&&(this.minScrollX=Number(this.getAttribute("min-scroll-x"))),this.hasAttribute("max-scroll-x")&&(this.maxScrollX=Number(this.getAttribute("max-scroll-x"))),this.hasAttribute("min-scroll-y")&&(this.minScrollY=Number(this.getAttribute("min-scroll-y"))),this.hasAttribute("max-scroll-y")&&(this.maxScrollY=Number(this.getAttribute("max-scroll-y"))),this.container?.addEventListener("scroll",this.showHide),this.render(),this.showHide()}renderCss(i){let s=[["0","z-index","1000",""],["0","position","fixed",""],["0","bottom","30px",""],["0","right","20px",""]];for(let t=0;t<i.length;t++){let e=i[t],[l,r]=e.split(":"),[h,a="0"]=l.split("--"),c=this.getAttribute(e);s.push([a,h,c,r])}let n=s.sort((t,e)=>t[3]?1:-1).sort((t,e)=>Number(t[0])-Number(e[0])).map(([t,e,l,r])=>`@media (min-width: ${t}px) { :host${r?`(:${r})`:""} { ${e}:${l}; }}`).join(`
`);return this.baseStyles+n}render(){let i=this.getAttributeNames().filter(s=>!this.behaviorAttributeNames.includes(s));this.styleSheet.replace(this.renderCss(i))}showHide(){this.container!==null&&(this.container instanceof Window?this.container.scrollY>this.minScrollY?this.style.display="block":this.style.display="none":this.container.scrollTop>this.minScrollY&&this.container.scrollTop<this.maxScrollY?this.style.display="block":this.style.display="none")}};customElements.define("dx-fab",o);})();
//# sourceMappingURL=dx-fab.js.map
