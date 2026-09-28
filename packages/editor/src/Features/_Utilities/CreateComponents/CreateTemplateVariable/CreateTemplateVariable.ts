import {
	createContentLine,
	createFormattableTexts,
	createInlineComponent,
	createNestedEditable,
} from "rich-text-area";
import { componentsName, createTemplateVariableStorage } from "#engine-links";
import type {
	CreateTemplateVariableParams,
	CreateTemplateVariableResult,
} from "./CreateTemplateVariable-types";

/*
 * Builds an inline template variable component for the given field, displaying its text as
 * editable, formattable content.
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
		childNodes: [
			createNestedEditable({
				content: { type: "default" },
				display: "inline",
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
