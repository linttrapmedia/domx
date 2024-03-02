"use strict";(()=>{var l=class extends HTMLElement{constructor(){super();this.behaviorAttributeNames=["value"];this.styleSheet=new CSSStyleSheet;this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML="<slot></slot>",this.render=this.render.bind(this),this.renderCss=this.renderCss.bind(this),this.setActiveTab=this.setActiveTab.bind(this),this.shadowRoot.adoptedStyleSheets=[this.styleSheet]}connectedCallback(){this.render()}renderCss(){return`:host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      width: 100%;
    }`}render(){this.styleSheet.replace(this.renderCss()),this.dispatchEvent(new CustomEvent("rendered")),this.setActiveTab(this.getAttribute("value")||"")}setActiveTab(e){this.querySelectorAll("dx-tab-button").forEach(r=>r.classList.remove("active")),(this?.querySelectorAll("dx-tab-panel")).forEach(r=>r.classList.remove("active"));let s=this.querySelector(`dx-tab-button[value="${e}"]`);s&&s.classList.add("active");let o=this.querySelector(`dx-tab-panel[value="${e}"]`);o&&o.classList.add("active"),this.setAttribute("value",e)}};customElements.define("dx-tabs",l);var a=class extends HTMLElement{constructor(){super();this.styleSheet=new CSSStyleSheet;this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML="<slot></slot>",this.render=this.render.bind(this),this.renderCss=this.renderCss.bind(this),this.renderBaseCss=this.renderBaseCss.bind(this),this.shadowRoot.adoptedStyleSheets=[this.styleSheet]}connectedCallback(){this.render()}renderBaseCss(){let e=this.closest("dx-tabs");return`:host {
      box-sizing: border-box;
      border-bottom: 3px solid ${e?e.getAttribute("accent-color"):"rgba(255,255,255,0.5)"};
      display: flex;
      flex-direction: row;
    }`}renderCss(e){return e.sort(t=>t[3]?1:-1).sort((t,s)=>Number(t[0])-Number(s[0])).map(([t,s,o,r,n=null])=>`@media (min-width: ${t}px) { :host${r?`(:${r}) ${n!==null?`::slotted(${n})`:""}`:` ${n!==null?`::slotted(${n})`:""}`} { ${s}:${o}; }}`).join(`
`)}render(){let e=this.getAttributeNames().map(i=>{let[t,s]=i.split(":"),[o,r="0"]=t.split("--"),n=this.getAttribute(i);return[r,o,n,s,void 0]});this.styleSheet.replace(this.renderBaseCss()+this.renderCss(e)),this.dispatchEvent(new CustomEvent("rendered"))}};customElements.define("dx-tab-buttons",a);var c=class extends HTMLElement{constructor(){super();this.styleSheet=new CSSStyleSheet;this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML="<slot></slot>",this.render=this.render.bind(this),this.renderBaseCss=this.renderBaseCss.bind(this),this.renderCss=this.renderCss.bind(this),this.handleClick=this.handleClick.bind(this),this.shadowRoot.adoptedStyleSheets=[this.styleSheet],this.addEventListener("click",this.handleClick)}connectedCallback(){this.render()}handleClick(){let e=this.closest("dx-tabs");e&&e.setActiveTab(this.getAttribute("value")||"")}renderBaseCss(){let e=this.closest("dx-tabs"),i=e?e.getAttribute("bg-color"):"#fff",t=e?e.getAttribute("bg-color:hover"):"#f0f0f0",s=e?e.getAttribute("fg-color"):"#000",o=e?e.getAttribute("fg-color:hover"):"#000",r=e?e.getAttribute("accent-color"):"rgba(255,255,255,0.5)",n=e?e.getAttribute("accent-color:hover"):"rgba(255,255,255,0.5)";return`:host {
      background-color: ${i};
      box-sizing: border-box;
      color: ${s};
      cursor: pointer;
      border-bottom: 3px solid ${r};
      display: flex;
      flex-direction: row;
      padding:1em;
      margin-bottom: -3px;
    }
    :host(:hover) {
      background-color: ${t};
      color: ${o};
    }
    
    :host(.active) {
      background-color: ${t};
      color: ${o};
      border-bottom: 3px solid ${n};
    }
    `}renderCss(e){return e.sort(t=>t[3]?1:-1).sort((t,s)=>Number(t[0])-Number(s[0])).map(([t,s,o,r,n=null])=>`@media (min-width: ${t}px) { :host${r?`(:${r}) ${n!==null?`::slotted(${n})`:""}`:` ${n!==null?`::slotted(${n})`:""}`} { ${s}:${o}; }}`).join(`
`)}render(){this.classList.add("tab-button");let e=this.getAttributeNames().map(i=>{let[t,s]=i.split(":"),[o,r="0"]=t.split("--"),n=this.getAttribute(i);return[r,o,n,s,void 0]});this.styleSheet.replace(this.renderBaseCss()+this.renderCss(e)),this.dispatchEvent(new CustomEvent("rendered"))}};customElements.define("dx-tab-button",c);var b=class extends HTMLElement{constructor(){super();this.styleSheet=new CSSStyleSheet;this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML="<slot></slot>",this.render=this.render.bind(this),this.renderCss=this.renderCss.bind(this),this.shadowRoot.adoptedStyleSheets=[this.styleSheet]}connectedCallback(){this.render()}renderCss(){return`:host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      position: relative;
    }`}render(){this.styleSheet.replace(this.renderCss()),this.dispatchEvent(new CustomEvent("rendered"))}};customElements.define("dx-tab-panels",b);var S=class extends HTMLElement{constructor(){super();this.styleSheet=new CSSStyleSheet;this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML="<slot></slot>",this.render=this.render.bind(this),this.renderCss=this.renderCss.bind(this),this.shadowRoot.adoptedStyleSheets=[this.styleSheet]}connectedCallback(){this.render()}renderCss(){return`:host {
      box-sizing: border-box;
      position: absolute;
      display: none;
    }
    :host(.active) {
      display: block;
      position: static;
    }
    `}render(){this.styleSheet.replace(this.renderCss()),this.dispatchEvent(new CustomEvent("rendered"))}};customElements.define("dx-tab-panel",S);})();
//# sourceMappingURL=dx-tabs.js.map
