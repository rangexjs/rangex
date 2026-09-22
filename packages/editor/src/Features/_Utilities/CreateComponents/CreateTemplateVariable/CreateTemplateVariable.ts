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
 * Builds an inline template variable component of the given kind, displaying its text as
 * editable, formattable content.
 */
export const createTemplateVariable = ({
	type,
	displayText,
}: CreateTemplateVariableParams): CreateTemplateVariableResult => {
	return createInlineComponent({
		componentName: componentsName.templateVariable,
		content: { type: "custom" },
		editState: "false",
		shouldSelectOnNavigation: true,
		customStorage: createTemplateVariableStorage({ type }),
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
