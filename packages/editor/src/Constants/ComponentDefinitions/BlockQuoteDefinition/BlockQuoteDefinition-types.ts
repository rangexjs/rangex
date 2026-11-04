import type { CreateNestedEditableParams } from "@rangex/core";

export interface BlockQuoteNestedEditableProps
	extends Pick<
		CreateNestedEditableParams,
		| "display"
		| "editState"
		| "allowedComponents"
		| "allowedContentLineLocalNames"
		| "allowedContentLineStyleAttrNames"
		| "allowedGlyphFormatterStyleAttrNames"
		| "allowedGlyphFormatterInlineTags"
	> {}

export interface BlockQuoteDefinition {
	nestedEditableProps: BlockQuoteNestedEditableProps;
}
