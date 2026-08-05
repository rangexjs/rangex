import anchorPositioningStyles from "./AnchorPositioningStyleSheet.css?inline";

/**
 * Bridges `range-x`'s exposed css anchor-positioning parts out to `rich-text-editor-ui`'s shadow
 * root, so an overlay mounted there can reference an anchor living inside `range-x`'s own shadow
 * root — anchor-name lookups don't cross tree-scopes on their own.
 */
const anchorPositioningStyleSheet = new CSSStyleSheet();
anchorPositioningStyleSheet.replaceSync(anchorPositioningStyles);

export { anchorPositioningStyleSheet };
