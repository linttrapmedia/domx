"use strict";(()=>{var a=class extends HTMLElement{constructor(){super();this.behaviorAttributeNames=[];this.styleSheet=new CSSStyleSheet;this.tabs={};this.tabsContainer=document.createElement("div");this.panelsContainer=document.createElement("div");this.attachShadow({mode:"open"}),this.render=this.render.bind(this),this.renderCss=this.renderCss.bind(this),this.addTab=this.addTab.bind(this),this.updateActiveTab=this.updateActiveTab.bind(this),this.updateTab=this.updateTab.bind(this),this.shadowRoot.adoptedStyleSheets=[this.styleSheet],new MutationObserver(s=>{s.forEach(t=>{t.type==="attributes"&&t.attributeName==="selected"&&t.target instanceof a&&this.updateActiveTab()})}).observe(this,{attributes:!0})}addTab(e){this.tabs[e.name]=e;let s=document.createElement("button");s.setAttribute("name",e.name),s.innerText=e.label,s.classList.add("tab"),s.onclick=()=>{this.setAttribute("selected",e.name),this.updateActiveTab()},this.tabsContainer.appendChild(s);let t=document.createElement("div");t.setAttribute("name",e.name),t.appendChild(e.content),t.classList.add("panel"),this.panelsContainer.appendChild(t);let n=this.getAttribute("selected");n===e.name&&t.classList.add("panel--active"),n===e.name&&s.classList.add("tab--active")}updateActiveTab(){let e=this.getAttribute("selected");this.tabsContainer.querySelectorAll(".tab").forEach(i=>i.classList.remove("tab--active"));let t=this.tabsContainer.querySelector(`[name=${e}]`);t&&t.classList.add("tab--active"),this.panelsContainer.querySelectorAll(".panel").forEach(i=>i.classList.remove("panel--active"));let o=this.panelsContainer.querySelector(`[name=${e}]`);o&&o.classList.add("panel--active")}connectedCallback(){this.render()}renderCss(){return`
        .tabs-container {
            display: flex;
            flex-direction: row;
            border-bottom: 2px solid rgba(255,255,255,0.2);
        }
        .tab {
            background-color: transparent;
            border-left: none;
            border-right: none;
            border-top: none;
            border-bottom: 2px solid transparent;
            color: white;
            padding: 10px;
            cursor: pointer;
            margin-bottom:-2px;
        }
        .tab--active {
            border-bottom: 2px solid white;
        }
        .panels-container {
            display: flex;
            flex-direction: row;
            gap: 10px;
        }
        .panel {
            display: none;
            padding: 20px 0;
        }
        .panel--active {
            display: block;
        }
    `}render(){this.tabsContainer.classList.add("tabs-container"),this.panelsContainer.classList.add("panels-container"),this.shadowRoot.appendChild(this.tabsContainer),this.shadowRoot.appendChild(this.panelsContainer),this.styleSheet.replace(this.renderCss()),this.dispatchEvent(new CustomEvent("rendered"))}updateTab(e){this.tabs[e.name]=e;let s=this.tabsContainer.querySelector(`[name=${e.name}]`);s&&(s.innerText=e.label);let t=this.panelsContainer.querySelector(`[name=${e.name}]`);t&&t.replaceWith(e.content)}};customElements.define("dx-tabs",a);var r=class extends HTMLElement{constructor(){super();this.behaviorAttributeNames=["label","icon"];this.styleSheet=new CSSStyleSheet;this.addedToTabs=!1;this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML="<slot></slot>",this.render=this.render.bind(this),this.shadowRoot.adoptedStyleSheets=[this.styleSheet],new MutationObserver(s=>{s.forEach(t=>{t.type==="attributes"&&this.render()})}).observe(this,{attributes:!0})}connectedCallback(){this.render()}render(){let e=this.parentElement;this.addedToTabs?e.updateTab({label:this.getAttribute("label")||"",name:this.getAttribute("name")||"",icon:this.getAttribute("icon")||"",content:this.shadowRoot.querySelector("slot")?.assignedNodes()[0]}):e instanceof a&&(e.addTab({label:this.getAttribute("label")||"",name:this.getAttribute("name")||"",icon:this.getAttribute("icon")||"",content:this.shadowRoot.querySelector("slot")?.assignedNodes()[0]}),this.addedToTabs=!0),this.dispatchEvent(new CustomEvent("rendered"))}};customElements.define("dx-tab",r);})();
//# sourceMappingURL=dx-tabs.js.map
