import type { TemplateVariableDefinition } from "./TemplateVariableDefinition-types";

/*
 * The state of every template variable's NestedEditable: createTemplateVariable builds it with this, and a snapshot's
 * template variable must match it. Its text is plain: no component, line tag, style or inline tag is allowed in it.
 */
export const templateVariableDefinition = {
	nestedEditableProps: {
		display: "inline",
		editState: "inherit",
		allowedComponents: [],
		allowedContentLineLocalNames: [],
		allowedContentLineStyleAttrNames: [],
		allowedGlyphFormatterStyleAttrNames: [],
		allowedGlyphFormatterInlineTags: [],
	},
} satisfies TemplateVariableDefinition;
