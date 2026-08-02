import { createContentLine } from "rich-text-area";
import {
	ensureNodeRootStorage,
	ensureTemplateVariableRootStorage,
} from "../../../Storage";
import { createTemplateVariable } from "../../_Utilities";
import { resolveTemplateVariableDisplayText } from "../_Utilities";
import type { HandleTemplateVariableInsertionParams } from "./HandleTemplateVariableInsertion-types";

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
