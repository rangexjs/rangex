import {
	createContentLine,
	createFormattableTexts,
	createInlineNestedContext,
	createNestedEditable,
} from "rich-text-area";
import { componentsName } from "#ports";
import {
	createTemplateVariableStorage,
	ensureNodeRootStorage,
	ensureTemplateVariableRootStorage,
} from "../../../Storage";
import { resolveTemplateVariableDisplayText } from "../_Utilities";
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
						localName: "span",
						childNodes: [...createFormattableTexts({ data: displayText })],
					}),
				],
			}),
		],
	});
};

export const handleTemplateVariableInsertion = ({
	editorPort,
	editorAPI,
}: HandleTemplateVariableInsertionParams) => {
	const unsubscribe = editorPort.onInsertRequest(({ kind }) => {
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
			lines: [
				createContentLine({ localName: "p", childNodes: [templateVariable] }),
			],
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
