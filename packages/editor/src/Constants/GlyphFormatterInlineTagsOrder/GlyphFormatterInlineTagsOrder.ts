import type { GlyphFormatterInlineTag } from "@rangex/core";

/*
 * The order inline tags nest in, the first outermost: it decides the HTML a GlyphFormatter is serialized to and how the
 * tags' styles cascade. It's fixed: a new root is built with it, and validateSnapshot replaces a snapshot's own order
 * with it. It must contain every inline tag exactly once.
 */
export const glyphFormatterInlineTagsOrder = [
	"strong",
	"b",
	"em",
	"i",
	"ins",
	"u",
	"del",
	"s",
	"mark",
	"small",
	"sub",
	"sup",
	"code",
	"kbd",
	"samp",
	"var",
] as const satisfies readonly GlyphFormatterInlineTag[];
