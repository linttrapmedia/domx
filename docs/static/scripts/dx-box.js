"use strict";(()=>{function l(e){let s="";for(let t in e)s+=`${t}: ${e[t]};`;return s}function d(e,s){e.attachShadow(s)}function h(e,s){let t=new CSSStyleSheet;return t.replace(s),e.shadowRoot.adoptedStyleSheets=[t],t}function c(e,s){let t=document.createElement("template");t.innerHTML=s;let n=t.content.cloneNode(!0);return e.shadowRoot.appendChild(n),n}var o=class extends HTMLElement{constructor(){super();this.baseStyles=`
  box-sizing: border-box;
  display: flex; 
  transition: padding 0.25s ease-in-out;`;d(this,{mode:"open"}),this.styleSheet=h(this,""),this.template=c(this,"<slot></slot>"),this.render=this.render.bind(this)}connectedCallback(){let t=this.parentElement?.closest("dx-mq");t.subscribe(this),this.render(t.calculateBreakpoint())}render(t){let n={};["align-items","border-color","border-radius","border-style","border-width","flex-direction","flex-wrap","flex-flow","gap","margin","padding","max-width"].forEach(i=>{this.hasAttribute(i)&&(n[i]=this.getAttribute(i)),this.hasAttribute(`${t}:${i}`)&&(n[i]=this.getAttribute(`${t}:${i}`))}),this.styleSheet.replace(`:host { 
      ${this.baseStyles}
      ${l(n)}
    }`),this.hasAttribute("debug")&&console.log(n)}};customElements.define("dx-box",o);var r=class extends o{constructor(){super(...arguments);this.baseStyles=`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: padding 0.25s ease-in-out;`}};customElements.define("dx-col",r);var a=class extends o{constructor(){super(...arguments);this.baseStyles=`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  transition: padding 0.25s ease-in-out;`}};customElements.define("dx-row",a);})();
//# sourceMappingURL=dx-box.js.map
