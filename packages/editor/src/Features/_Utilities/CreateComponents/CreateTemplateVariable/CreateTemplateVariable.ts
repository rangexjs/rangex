import {
	createContentLine,
	createFormattableTexts,
	createInlineComponent,
	createNestedEditable,
} from "@rangex/core";
import { componentsName } from "#constants";
import { createTemplateVariableStorage } from "#storage";
import type {
	CreateTemplateVariableParams,
	CreateTemplateVariableResult,
} from "./CreateTemplateVariable-types";

/*
 * Builds an inline template variable component for the given field. Its NestedEditable allows no formatting and no
 * components, so it only holds the display text's FormattableTexts.
 */
export const createTemplateVariable = ({
	fieldName,
	displayText,
}: CreateTemplateVariableParams): CreateTemplateVariableResult => {
	return createInlineComponent({
		name: componentsName.templateVariable,
		content: { type: "custom" },
		editState: "false",
		shouldSelectOnNavigation: true,
		customStorage: createTemplateVariableStorage({ fieldName }),
		shouldSelectBeforeRemove: false,
		childNodes: [
			createNestedEditable({
				display: "inline",
				editState: "inherit",
				allowedComponents: [],
				allowedContentLineLocalNames: [],
				allowedContentLineStyleAttrNames: [],
				allowedGlyphFormatterStyleAttrNames: [],
				allowedGlyphFormatterInlineTags: [],
				childNodes: [
					createContentLine({
						localName: "span",
						childNodes: [...createFormattableTexts({ data: displayText })],
					}),
				],
			}),
		],
	});
};
