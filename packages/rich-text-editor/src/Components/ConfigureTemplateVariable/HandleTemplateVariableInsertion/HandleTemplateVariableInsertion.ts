import {
	createContentLine,
	createFormattableTexts,
	createInlineNestedContext,
	createNestedEditable,
} from "rich-text-area";
import { componentsName } from "../../../Constants";
import type {
	CreateTemplateVariableComponentParams,
	CreateTemplateVariableComponentResult,
	HandleTemplateVariableInsertionParams,
} from "./HandleTemplateVariableInsertion-types";

const createTemplateVariableComponent = ({
	// biome-ignore lint/correctness/noUnusedFunctionParameters: Implement later
	data,
}: CreateTemplateVariableComponentParams): CreateTemplateVariableComponentResult => {
	const inlineNestedContext = createInlineNestedContext({
		componentName: componentsName.templateVariable,
		content: { type: "custom" },
		editState: "false",
		shouldSelectOnNavigation: true,
		childNodes: [
			createNestedEditable({
				content: { type: "default" },
				display: "inline",
				childNodes: [
					createContentLine({
						childNodes: [
							...createFormattableTexts({ data: "{{TemplateVariable}}" }),
						],
					}),
				],
			}),
		],
	});

	return inlineNestedContext;
};

export const handleTemplateVariableInsertion = ({
	richTextEditorUI,
	editorAPI,
}: HandleTemplateVariableInsertionParams) => {
	const unsubscribe = richTextEditorUI.onNodeInsertion((params) => {
		// Temporary till we implement the blocking features
		if (params.type !== "template-variable") {
			return;
		}

		// Temporary till we implement the blocking features
		if (params.action === "insertion" && params.kind === "first-name") {
			const templateVariable = createTemplateVariableComponent({ data: "" });

			const selection = editorAPI.getEditorSelection();

			const { fromText, fromOffset } = selection.getBoundaryPoints();

			editorAPI.insertNode({
				fromNode: fromText,
				fromOffset,
				lines: [createContentLine({ childNodes: [templateVariable] })],
				breakBeforeInsert: false,
			});
		}
	});

	return () => {
		unsubscribe();
	};
};
