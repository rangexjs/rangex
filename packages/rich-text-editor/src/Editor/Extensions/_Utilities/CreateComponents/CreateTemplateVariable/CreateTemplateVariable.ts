import {
	createContentLine,
	createFormattableTexts,
	createInlineNestedContext,
	createNestedEditable,
} from "rich-text-area";
import { componentsName } from "#ports";
import { createTemplateVariableStorage } from "../../../../Storage";
import type {
	CreateTemplateVariableParams,
	CreateTemplateVariableResult,
} from "./CreateTemplateVariable-types";

export const createTemplateVariable = ({
	type,
	displayText,
}: CreateTemplateVariableParams): CreateTemplateVariableResult => {
	return createInlineNestedContext({
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
