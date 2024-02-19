export const polyfillStyleSheet = (obj: any) => {
  CSSStyleSheet.prototype.replace = function (
    newStyles: string
  ): Promise<CSSStyleSheet> {
    return new Promise((resolve, reject) => {
      try {
        // Remove all existing rules
        while (this.cssRules.length > 0) {
          this.deleteRule(0);
        }

        // Add new rules
        newStyles.split("}").forEach((rule) => {
          const trimmedRule = rule.trim();
          if (trimmedRule) {
            this.insertRule(trimmedRule + "}", this.cssRules.length);
          }
        });

        resolve(this);
      } catch (error) {
        reject(error);
      }
    });
  };
  Object.defineProperty(obj.prototype, "styleSheet", {
    value: new CSSStyleSheet(),
    writable: true,
    enumerable: true,
    configurable: true,
  });
};
