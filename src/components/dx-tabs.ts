type Tab = {
  label: string;
  name: string;
  icon: string;
  content: HTMLElement;
};

export class DomxTabs extends HTMLElement {
  behaviorAttributeNames: string[] = [];
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  tabs: Record<string, Tab> = {};
  tabsContainer: HTMLDivElement = document.createElement("div");
  panelsContainer: HTMLDivElement = document.createElement("div");
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render = this.render.bind(this);
    this.renderCss = this.renderCss.bind(this);
    this.addTab = this.addTab.bind(this);
    this.updateActiveTab = this.updateActiveTab.bind(this);
    this.updateTab = this.updateTab.bind(this);
    this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "selected" &&
          mutation.target instanceof DomxTabs
        ) {
          this.updateActiveTab();
        }
      });
    });
    observer.observe(this, { attributes: true });
  }
  addTab(tab: Tab) {
    this.tabs[tab.name] = tab;
    const tabButton = document.createElement("button");
    tabButton.setAttribute("name", tab.name);
    tabButton.innerText = tab.label;
    tabButton.classList.add("tab");
    tabButton.onclick = () => {
      this.setAttribute("selected", tab.name);
      this.updateActiveTab();
    };
    this.tabsContainer.appendChild(tabButton);
    const tabPanel = document.createElement("div");
    tabPanel.setAttribute("name", tab.name);
    tabPanel.appendChild(tab.content);
    tabPanel.classList.add("panel");
    this.panelsContainer.appendChild(tabPanel);

    const selected = this.getAttribute("selected");
    if (selected === tab.name) tabPanel.classList.add("panel--active");
    if (selected === tab.name) tabButton.classList.add("tab--active");
  }
  updateActiveTab() {
    const tabName = this.getAttribute("selected");

    const tabs = this.tabsContainer.querySelectorAll(".tab");
    tabs.forEach((tab) => tab.classList.remove("tab--active"));
    const selectedTab = this.tabsContainer.querySelector(`[name=${tabName}]`);
    if (selectedTab) selectedTab.classList.add("tab--active");

    const panels = this.panelsContainer.querySelectorAll(".panel");
    panels.forEach((panel) => panel.classList.remove("panel--active"));
    const selectedPanel = this.panelsContainer.querySelector(
      `[name=${tabName}]`
    );
    if (selectedPanel) selectedPanel.classList.add("panel--active");
  }
  connectedCallback() {
    this.render();
  }
  renderCss() {
    return `
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
    `;
  }
  render() {
    this.tabsContainer.classList.add("tabs-container");
    this.panelsContainer.classList.add("panels-container");
    this.shadowRoot!.appendChild(this.tabsContainer);
    this.shadowRoot!.appendChild(this.panelsContainer);
    this.styleSheet.replace(this.renderCss());
    this.dispatchEvent(new CustomEvent("rendered"));
  }
  updateTab(tab: Tab) {
    this.tabs[tab.name] = tab;
    const tabButton = this.tabsContainer.querySelector(`[name=${tab.name}]`);
    if (tabButton) (tabButton as HTMLElement).innerText = tab.label;
    const tabPanel = this.panelsContainer.querySelector(`[name=${tab.name}]`);
    if (tabPanel) tabPanel.replaceWith(tab.content);
  }
}

customElements.define("dx-tabs", DomxTabs);

export class DomxTab extends HTMLElement {
  behaviorAttributeNames: string[] = ["label", "icon"];
  styleSheet: CSSStyleSheet = new CSSStyleSheet();
  addedToTabs: boolean = false;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = "<slot></slot>";
    this.render = this.render.bind(this);
    this.shadowRoot!.adoptedStyleSheets = [this.styleSheet];
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") this.render();
      });
    });
    observer.observe(this, { attributes: true });
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const parentTabs = this.parentElement as DomxTabs;
    if (!this.addedToTabs) {
      if (parentTabs instanceof DomxTabs) {
        parentTabs.addTab({
          label: this.getAttribute("label") || "",
          name: this.getAttribute("name") || "",
          icon: this.getAttribute("icon") || "",
          content: this.shadowRoot!.querySelector(
            "slot"
          )?.assignedNodes()[0] as HTMLElement,
        });
        this.addedToTabs = true;
      }
    } else {
      parentTabs.updateTab({
        label: this.getAttribute("label") || "",
        name: this.getAttribute("name") || "",
        icon: this.getAttribute("icon") || "",
        content: this.shadowRoot!.querySelector(
          "slot"
        )?.assignedNodes()[0] as HTMLElement,
      });
    }
    this.dispatchEvent(new CustomEvent("rendered"));
  }
}

customElements.define("dx-tab", DomxTab);
