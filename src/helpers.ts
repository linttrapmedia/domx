export function cssObjectToString(css: any): string {
  let str = "";
  for (let key in css) {
    str += `${key}: ${css[key]};`;
  }
  return str;
}

export function mergeByIndex(arr1: any[], arr2: any[]): any[] {
  let merged: any[] = [...arr1];
  for (let i = 0; i < arr2.length; i++) {
    if (i < merged.length) {
      merged[i] = arr2[i];
    } else {
      merged.push(arr2[i]);
    }
  }
  return merged;
}

export function attachShadow(el: HTMLElement, init: ShadowRootInit) {
  el.attachShadow(init);
}

export function attachStyles(el: HTMLElement, styles: string) {
  let sheet = new CSSStyleSheet();
  sheet.replace(styles);
  el.shadowRoot!.adoptedStyleSheets = [sheet];
  return sheet;
}

export function attachTemplate(el: HTMLElement, template: string) {
  const templateEl = document.createElement("template");
  templateEl.innerHTML = template;
  const node = templateEl.content.cloneNode(true);
  el.shadowRoot!.appendChild(node);
  return node;
}
