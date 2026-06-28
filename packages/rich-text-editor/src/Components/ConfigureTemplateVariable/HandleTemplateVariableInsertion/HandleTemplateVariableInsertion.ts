import {
	createContentLine,
	createFormattableTexts,
	createInlineNestedContext,
	createNestedEditable,
} from "rich-text-area";
import { ensureNodeRootStorage } from "../../../_Utilities";
import { componentsName } from "../../../Constants";
import { resolveTemplateVariableDisplayText } from "../_Utilities";
import {
	createTemplateVariableStorage,
	ensureTemplateVariableRootStorage,
} from "../TemplateVariableStorage";
import type {
	CreateTemplateVariableComponentParams,
	CreateTemplateVariableComponentResult,
	HandleTemplateVariableInsertionParams,
} from "./HandleTemplateVariableInsertion-types";

const createTemplateVariableComponent = ({
	type,
	displayText,
}: CreateTemplateVariableComponentParams): CreateTemplateVariableComponentResult => {
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
						childNodes: [...createFormattableTexts({ data: displayText })],
					}),
				],
			}),
		],
	});
};

export const handleTemplateVariableInsertion = ({
	richTextEditorUI,
	editorAPI,
}: HandleTemplateVariableInsertionParams) => {
	const unsubscribe = richTextEditorUI.onNodeInsertion((params) => {
		if (params.type !== "template-variable" || params.action !== "insertion") {
			return;
		}

		const { kind } = params;
		const { rootEditable } = editorAPI;

		const rootStorage = ensureNodeRootStorage({ rootEditable });
		const storage = ensureTemplateVariableRootStorage({ rootStorage });
		const displayText = resolveTemplateVariableDisplayText({
			type: kind,
			storage,
		});

		const templateVariable = createTemplateVariableComponent({
			type: kind,
			displayText,
		});

		const selection = editorAPI.getEditorSelection();
		const { fromText, fromOffset } = selection.getBoundaryPoints();

		editorAPI.insertNode({
			fromNode: fromText,
			fromOffset,
			lines: [createContentLine({ childNodes: [templateVariable] })],
			breakBeforeInsert: false,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
