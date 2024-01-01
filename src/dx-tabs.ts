import { attachShadow, attachStyles, attachTemplate } from "./helpers";

const DomTabBtnStyles = `
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

class DomTabBtn extends HTMLElement {
  constructor() {
    super();
    attachShadow(this, { mode: "open" });
    attachStyles(this, DomTabBtnStyles);
    attachTemplate(this, `<slot></slot>`);
  }
  connectedCallback() {
    this.slot = "tabs";
    const parent = this.parentElement as DomTabs;
    if (!parent) return;
    this.addEventListener("click", () => parent.setActiveTab(this));
  }
}

customElements.define("dx-tab-btn", DomTabBtn);

const DomTabPanelStyles = `
:host {
  display: none;
  width: 100%;
}
:host([active]) {
  display: block;
}
`;

class DomTabPanel extends HTMLElement {
  constructor() {
    super();
    attachShadow(this, { mode: "open" });
    attachStyles(this, DomTabPanelStyles);
    attachTemplate(this, "<slot></slot>");
  }
  connectedCallback() {
    this.slot = "panels";
  }
}

customElements.define("dx-tab-panel", DomTabPanel);

const domTabsStyles = `

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

const domTabsTemplate = `<div><slot name="tabs"></slot><slot name="panels"></slot></div>`;

class DomTabs extends HTMLElement {
  activeTab: string = "";
  constructor() {
    super();
    attachShadow(this, { mode: "open" });
    attachStyles(this, domTabsStyles);
    attachTemplate(this, domTabsTemplate);
    this.setActiveTab = this.setActiveTab.bind(this);
  }
  setActiveTab(tabBtn: DomTabBtn) {
    const tabs = this.querySelectorAll("dx-tab-btn");
    const panels = this.querySelectorAll("dx-tab-panel");
    tabs.forEach((t) => t.removeAttribute("active"));
    panels.forEach((p) => p.removeAttribute("active"));
    tabBtn.setAttribute("active", "");
    const panelId = tabBtn.getAttribute("panel");
    const panel = this.querySelector(`dx-tab-panel#${panelId}`);
    panel!.setAttribute("active", "");
  }
  // addTab(t: DomTab) {
  //   const tabs = this.shadowRoot!.querySelector(".tabs");
  //   const button = document.createElement("button");
  //   const isActive = t.getAttribute("active") !== null;
  //   const title = t.getAttribute("title") || "";
  //   const content = t.innerHTML;

  //   if (Boolean(isActive)) this.activeTab = title;

  //   button.classList.add("tab");
  //   if (isActive) button.classList.add("tab--active");
  //   button.textContent = title;
  //   tabs!.appendChild(button);
  //   button.addEventListener("click", () => this.setActiveTab(title, content));

  //   if (isActive) this.setActiveTab(title, content);
  // }
  // setActiveTab(title: string, content: string) {
  //   this.activeTab = title;
  //   const tabs = this.shadowRoot!.querySelectorAll(".tab");
  //   const slide = this.shadowRoot!.querySelector(".slide");
  //   console.log(title, content);
  //   tabs.forEach((t) => {
  //     if (t.textContent === this.activeTab) {
  //       t.classList.add("tab--active");
  //     } else {
  //       t.classList.remove("tab--active");
  //     }
  //   });
  //   slide!.innerHTML = content;
  // }
}

customElements.define("dx-tabs", DomTabs);
