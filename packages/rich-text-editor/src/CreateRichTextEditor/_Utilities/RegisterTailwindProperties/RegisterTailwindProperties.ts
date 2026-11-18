import type { RegisterTailwindPropertiesParams } from "./RegisterTailwindProperties-types";

let propertiesStyleSheet: CSSStyleSheet | null = null;
let registrationCount = 0;

const createPropertiesStyleSheet = ({ styleSheet }: RegisterTailwindPropertiesParams) => {
  const propertyRules = [...styleSheet.cssRules].filter((rule) => rule instanceof CSSPropertyRule);
  const propertiesCSS = propertyRules.map((rule) => rule.cssText).join("\n");

  const propertiesStyleSheet = new CSSStyleSheet();
  propertiesStyleSheet.replaceSync(propertiesCSS);

  return propertiesStyleSheet;
};

/**
 * Copies the `@property` rules of `styleSheet` into a stylesheet adopted by the document, shared by every editor
 * on the page. Browsers ignore `@property` inside shadow roots, and Tailwind relies on their `initial-value`s
 * (e.g. `--tw-border-style: solid` for `border`), so without this those utilities break in a shadow root.
 * Returns an unregister function; the stylesheet is removed from the document once every registration is undone.
 *
 * @see https://github.com/tailwindlabs/tailwindcss/issues/15005#issuecomment-2621978261
 */
export const registerTailwindProperties = ({ styleSheet }: RegisterTailwindPropertiesParams) => {
  if (!propertiesStyleSheet) {
    propertiesStyleSheet = createPropertiesStyleSheet({ styleSheet });
    document.adoptedStyleSheets.push(propertiesStyleSheet);
  }

  registrationCount++;

  let isUnregistered = false;

  return () => {
    if (isUnregistered) {
      return;
    }

    isUnregistered = true;
    registrationCount--;

    if (registrationCount > 0 || !propertiesStyleSheet) {
      return;
    }

    const index = document.adoptedStyleSheets.indexOf(propertiesStyleSheet);

    if (index !== -1) {
      document.adoptedStyleSheets.splice(index, 1);
    }

    propertiesStyleSheet = null;
  };
};
