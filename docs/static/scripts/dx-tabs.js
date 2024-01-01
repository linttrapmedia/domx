"use strict";(()=>{function a(o,t){o.attachShadow(t)}function s(o,t){let e=new CSSStyleSheet;return e.replace(t),o.shadowRoot.adoptedStyleSheets=[e],e}function r(o,t){let e=document.createElement("template");e.innerHTML=t;let n=e.content.cloneNode(!0);return o.shadowRoot.appendChild(n),n}var p=`
:host {
  background-color: var(--dx-color-primary-bg-light, var(--dx-tabs-bg, transparent));
  border-bottom-width: var(--tabs-btn-border-width, 5px);
  border-bottom-style: solid;
  border-bottom-color: transparent;
  font-family: var(--tabs-btn-font-family, Arial);
  font-size: var(--tabs-btn-font-size, 14px);
  font-weight: var(--tabs-btn-font-weight, normal);
  color: var(--tabs-btn-color, white);
  cursor: pointer;
  outline: none;
  opacity: 0.35;
  padding: var(--tabs-btn-padding, 10px);
}

:host(:hover),
:host([active]){
  border-bottom-color: var(--tabs-btn-border-color, white);
  opacity: 1;
  transition: border-bottom-color 0.25s ease-in-out;
}
`,l=class extends HTMLElement{constructor(){super(),a(this,{mode:"open"}),s(this,p),r(this,"<slot></slot>")}connectedCallback(){this.slot="tabs";let t=this.parentElement;!t||this.addEventListener("click",()=>t.setActiveTab(this))}};customElements.define("dx-tab-btn",l);var m=`
:host {
  display: none;
  width: 100%;
}
:host([active]) {
  display: block;
}
`,c=class extends HTMLElement{constructor(){super(),a(this,{mode:"open"}),s(this,m),r(this,"<slot></slot>")}connectedCallback(){this.slot="panels"}};customElements.define("dx-tab-panel",c);var u=`

:host {
  width: 100%;
  display: flex;
  flex-direction:column;
  width: 100%;
}

[name="tabs"] {
  align-items: center;
  background-color: var(--tabs-panel-bg, transparent);
  background-image: linear-gradient(to top, var(--tabs-btn-border-color-inactive, rgba(0,0,0,0.15)) 5px, transparent 5px);
  background-repeat: no-repeat;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow-x: auto;
  width: 100%;
}

[name="panels"] {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  overflow-x: auto;
}

 `,f='<div><slot name="tabs"></slot><slot name="panels"></slot></div>',d=class extends HTMLElement{constructor(){super();this.activeTab="";a(this,{mode:"open"}),s(this,u),r(this,f),this.setActiveTab=this.setActiveTab.bind(this)}setActiveTab(e){let n=this.querySelectorAll("dx-tab-btn"),b=this.querySelectorAll("dx-tab-panel");n.forEach(i=>i.removeAttribute("active")),b.forEach(i=>i.removeAttribute("active")),e.setAttribute("active","");let h=e.getAttribute("panel");this.querySelector(`dx-tab-panel#${h}`).setAttribute("active","")}};customElements.define("dx-tabs",d);})();
//# sourceMappingURL=dx-tabs.js.map
