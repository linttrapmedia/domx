"use strict";(()=>{var h=class extends HTMLElement{constructor(){super();this.behaviorAttributeNames=["value"];this.styleSheet=new CSSStyleSheet;this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML="<slot></slot>",this.render=this.render.bind(this),this.renderCss=this.renderCss.bind(this),this.setActiveTab=this.setActiveTab.bind(this),this.shadowRoot.adoptedStyleSheets=[this.styleSheet]}connectedCallback(){this.render()}renderCss(){return`:host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      width: 100%;
    }`}render(){this.styleSheet.replace(this.renderCss()),this.dispatchEvent(new CustomEvent("rendered")),this.setActiveTab(this.getAttribute("value")||"")}setActiveTab(e){this.querySelectorAll("dx-tab-button").forEach(s=>s.classList.remove("active")),(this?.querySelectorAll("dx-tab-panel")).forEach(s=>s.classList.remove("active"));let n=this.querySelector(`dx-tab-button[value="${e}"]`);n&&n.classList.add("active");let t=this.querySelector(`dx-tab-panel[value="${e}"]`);t&&t.classList.add("active"),this.setAttribute("value",e)}};customElements.define("dx-tabs",h);var l=class extends HTMLElement{constructor(){super();this.styleSheet=new CSSStyleSheet;this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML="<slot></slot>",this.render=this.render.bind(this),this.renderCss=this.renderCss.bind(this),this.shadowRoot.adoptedStyleSheets=[this.styleSheet]}connectedCallback(){this.render()}renderCss(){let e=this.closest("dx-tabs");return`:host {
      box-sizing: border-box;
      border-bottom: 3px solid ${e?e.getAttribute("accent-color"):"rgba(255,255,255,0.5)"};
      display: flex;
      flex-direction: row;
    }`}render(){this.styleSheet.replace(this.renderCss()),this.dispatchEvent(new CustomEvent("rendered"))}};customElements.define("dx-tab-buttons",l);var c=class extends HTMLElement{constructor(){super();this.styleSheet=new CSSStyleSheet;this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML="<slot></slot>",this.render=this.render.bind(this),this.renderCss=this.renderCss.bind(this),this.handleClick=this.handleClick.bind(this),this.shadowRoot.adoptedStyleSheets=[this.styleSheet],this.addEventListener("click",this.handleClick)}connectedCallback(){this.render()}handleClick(){let e=this.closest("dx-tabs");e&&e.setActiveTab(this.getAttribute("value")||"")}renderCss(){let e=this.closest("dx-tabs"),i=e?e.getAttribute("bg-color"):"#fff",d=e?e.getAttribute("bg-color:hover"):"#f0f0f0",n=e?e.getAttribute("fg-color"):"#000",t=e?e.getAttribute("fg-color:hover"):"#000",s=e?e.getAttribute("accent-color"):"rgba(255,255,255,0.5)",S=e?e.getAttribute("accent-color:hover"):"rgba(255,255,255,0.5)";return`:host {
      background-color: ${i};
      box-sizing: border-box;
      color: ${n};
      cursor: pointer;
      border-bottom: 3px solid ${s};
      display: flex;
      flex-direction: row;
      padding:1em;
      margin-bottom: -3px;
    }
    :host(:hover) {
      background-color: ${d};
      color: ${t};
    }
    
    :host(.active) {
      background-color: ${d};
      color: ${t};
      border-bottom: 3px solid ${S};
    }
    `}render(){this.classList.add("tab-button"),this.styleSheet.replace(this.renderCss()),this.dispatchEvent(new CustomEvent("rendered"))}};customElements.define("dx-tab-button",c);var a=class extends HTMLElement{constructor(){super();this.styleSheet=new CSSStyleSheet;this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML="<slot></slot>",this.render=this.render.bind(this),this.renderCss=this.renderCss.bind(this),this.shadowRoot.adoptedStyleSheets=[this.styleSheet]}connectedCallback(){this.render()}renderCss(){return`:host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      position: relative;
    }`}render(){this.styleSheet.replace(this.renderCss()),this.dispatchEvent(new CustomEvent("rendered"))}};customElements.define("dx-tab-panels",a);var b=class extends HTMLElement{constructor(){super();this.styleSheet=new CSSStyleSheet;this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML="<slot></slot>",this.render=this.render.bind(this),this.renderCss=this.renderCss.bind(this),this.shadowRoot.adoptedStyleSheets=[this.styleSheet]}connectedCallback(){this.render()}renderCss(){return`:host {
      box-sizing: border-box;
      position: absolute;
      display: none;
      padding: 1em;
    }
    :host(.active) {
      display: block;
      position: static;
    }
    `}render(){this.styleSheet.replace(this.renderCss()),this.dispatchEvent(new CustomEvent("rendered"))}};customElements.define("dx-tab-panel",b);})();
//# sourceMappingURL=dx-tabs.js.map
