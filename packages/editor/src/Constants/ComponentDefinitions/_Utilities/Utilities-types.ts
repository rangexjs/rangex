import type { CreateNestedEditableParams } from "@rangex/core";

// The state of a component's NestedEditable that a definition fixes: everything but its content and its attributes
export interface NestedEditableDefinition extends Pick<
	CreateNestedEditableParams,
	| "display"
	| "editState"
	| "allowedComponents"
	| "allowedContentLineLocalNames"
	| "allowedContentLineStyleAttrNames"
	| "allowedGlyphFormatterStyleAttrNames"
	| "allowedGlyphFormatterInlineTags"
> {}
