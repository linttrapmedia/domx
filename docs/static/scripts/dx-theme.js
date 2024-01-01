"use strict";(()=>{function n(t,o){t.attachShadow(o)}function l(t,o){let e=new CSSStyleSheet;return e.replace(o),t.shadowRoot.adoptedStyleSheets=[e],e}function s(t,o){let e=document.createElement("template");e.innerHTML=o;let r=e.content.cloneNode(!0);return t.shadowRoot.appendChild(r),r}var d=`
--dx-theme-primary-color: goldenrod;
--dx-theme-secondary-color: #6efa8e;
--dx-theme-tertiary-color: #fa6a6a;
--dx-theme-info-color: #6afafa;
--dx-theme-success-color: #6efa8e;
--dx-theme-warning-color: #faf46a;
--dx-theme-danger-color: #fa6a6a;
--dx-theme-text-color: #333333;
--dx-theme-bg-color: #ffffff;
--dx-theme-color-black: #333333;
--dx-theme-color-white: #ffffff;
`,i=`
--dx-theme-primary-color: goldenrod;
--dx-theme-secondary-color: #3dda4e;
--dx-theme-tertiary-color: #da3a3a;
--dx-theme-info-color: #3adada;
--dx-theme-success-color: #3dda4e;
--dx-theme-warning-color: #dad53a;
--dx-theme-danger-color: #da3a3a;
--dx-theme-text-color: #ffffff;
--dx-theme-bg-color: #111111;
--dx-theme-color-black: #ffffff;
--dx-theme-color-white: #333333;
`,h=`
--dx-theme-font-primary: "Playfair Display", Georgia, serif; 
--dx-theme-font-secondary: "Lato", "Helvetica Neue", Helvetica, Arial, sans-serif; 
--dx-theme-font-tertiary: "Roboto Slab", Times, serif; 
--dx-theme-font-size-small: 14px; 
--dx-theme-font-size-medium: 18px; 
--dx-theme-font-size-large: 24px; 
--dx-theme-font-size-xlarge: 30px; 
`,c=`
--dx-theme-font-primary: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif; 
--dx-theme-font-secondary: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif; 
--dx-theme-font-tertiary: "Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif; 
--dx-theme-font-size-small: 12px; 
--dx-theme-font-size-medium: 16px; 
--dx-theme-font-size-large: 20px; 
--dx-theme-font-size-xlarge: 26px; 
`,a=class extends HTMLElement{constructor(){super();this.colorScheme="lite";this.fontScheme="elegant";n(this,{mode:"open"}),s(this,"<slot></slot>"),this.render=this.render.bind(this),this.setupStyleSheet()}attributeChangedCallback(){this.colorScheme=this.hasAttribute("dark")?"dark":"lite",this.fontScheme=this.hasAttribute("app")?"modern":"elegant",this.render()}connectedCallback(){this.colorScheme=this.hasAttribute("dark")?"dark":"lite",this.fontScheme=this.hasAttribute("modern")?"modern":"elegant",this.render()}disconnectedCallback(){window.removeEventListener("resize",this.render)}render(){let e=this.colorScheme==="dark"?i:d,r=this.fontScheme==="modern"?c:h;this.styleSheet.replace(`:host { 
      ${e} 
      ${r} 
      display:block;
      background-color: var(--dx-theme-bg-color);
      height: 100%;
      width: 100%;}`)}setupStyleSheet(){this.styleSheet=l(this,":host { }")}static get observedAttributes(){return["dark","lite","app","blog"]}};customElements.define("dx-theme",a);})();
//# sourceMappingURL=dx-theme.js.map
