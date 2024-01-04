export const AttrMap = {
  "--bg-black": "background-color",
  "--bg-danger": "background-color",
  "--bg-info": "background-color",
  "--bg-success": "background-color",
  "--bg-text": "background-color",
  "--bg-warn": "background-color",
  "--bg-white": "background-color",
  "--font-mono": "font-family",
  "--font-sans": "font-family",
  "--font-serif": "font-family",
  "--font-splash": "font-family",
  "--txt-black": "color",
  "--txt-danger": "color",
  "--txt-info": "color",
  "--txt-lg": "font-size",
  "--txt-md": "font-size",
  "--txt-sm": "font-size",
  "--txt-success": "color",
  "--txt-text": "color",
  "--txt-warn": "color",
  "--txt-white": "color",
  "--txt-xl": "font-size",
  "--txt-center": "text-align",
} as const;

export type AttrProp = keyof typeof AttrMap;

export const AtomMap = {
  "--ff": "font-family",
  "--fs": "font-size",
  "--fw": "font-weight",
  "--lh": "line-height",
  "--ls": "letter-spacing",
  "--ta": "text-align",
  "--td": "text-decoration",
  "--tt": "text-transform",
  "--clr": "text-color",
};
