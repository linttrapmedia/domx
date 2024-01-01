"use strict";
(() => {
  // src/helpers.ts
  function attachShadow(el, init) {
    el.attachShadow(init);
  }
  function attachStyles(el, styles) {
    let sheet = new CSSStyleSheet();
    sheet.replace(styles);
    el.shadowRoot.adoptedStyleSheets = [sheet];
    return sheet;
  }
  function attachTemplate(el, template) {
    const templateEl = document.createElement("template");
    templateEl.innerHTML = template;
    const node = templateEl.content.cloneNode(true);
    el.shadowRoot.appendChild(node);
    return node;
  }

  // src/dx-tabs.ts
  var DomTabBtnStyles = `
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
`;
  var DomTabBtn = class extends HTMLElement {
    constructor() {
      super();
      attachShadow(this, { mode: "open" });
      attachStyles(this, DomTabBtnStyles);
      attachTemplate(this, `<slot></slot>`);
    }
    connectedCallback() {
      this.slot = "tabs";
      const parent = this.parentElement;
      if (!parent)
        return;
      this.addEventListener("click", () => parent.setActiveTab(this));
    }
  };
  customElements.define("dx-tab-btn", DomTabBtn);
  var DomTabPanelStyles = `
:host {
  display: none;
  width: 100%;
}
:host([active]) {
  display: block;
}
`;
  var DomTabPanel = class extends HTMLElement {
    constructor() {
      super();
      attachShadow(this, { mode: "open" });
      attachStyles(this, DomTabPanelStyles);
      attachTemplate(this, "<slot></slot>");
    }
    connectedCallback() {
      this.slot = "panels";
    }
  };
  customElements.define("dx-tab-panel", DomTabPanel);
  var domTabsStyles = `

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

 `;
  var domTabsTemplate = `<div><slot name="tabs"></slot><slot name="panels"></slot></div>`;
  var DomTabs = class extends HTMLElement {
    constructor() {
      super();
      this.activeTab = "";
      attachShadow(this, { mode: "open" });
      attachStyles(this, domTabsStyles);
      attachTemplate(this, domTabsTemplate);
      this.setActiveTab = this.setActiveTab.bind(this);
    }
    setActiveTab(tabBtn) {
      const tabs = this.querySelectorAll("dx-tab-btn");
      const panels = this.querySelectorAll("dx-tab-panel");
      tabs.forEach((t) => t.removeAttribute("active"));
      panels.forEach((p) => p.removeAttribute("active"));
      tabBtn.setAttribute("active", "");
      const panelId = tabBtn.getAttribute("panel");
      const panel = this.querySelector(`dx-tab-panel#${panelId}`);
      panel.setAttribute("active", "");
    }
  };
  customElements.define("dx-tabs", DomTabs);
})();
//# sourceMappingURL=dx-tabs.js.map
