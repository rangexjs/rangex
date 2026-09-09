import { createContentLine } from "rich-text-area";
import { ensureNodeRootStorage } from "#engine-links";
import { createTemplateVariable } from "../../_Utilities";
import { resolveTemplateVariableDisplayText } from "../_Utilities";
import type { HandleTemplateVariableInsertionParams } from "./HandleTemplateVariableInsertion-types";

export const handleTemplateVariableInsertion = ({
	configPort,
	editorAPI,
}: HandleTemplateVariableInsertionParams) => {
	const unsubscribe = configPort.onInsert(({ kind }) => {
		const { rootEditable } = editorAPI;

		const rootStorage = ensureNodeRootStorage({ rootEditable });

		const displayText = resolveTemplateVariableDisplayText({
			type: kind,
			storage: rootStorage.templateVariable,
		});

		const templateVariable = createTemplateVariable({
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
