import { createContentLine } from "@rangex/core";
import { getRootStorage } from "#storage";
import {
	createTemplateVariable,
	validateTemplateVariablePlacement,
} from "../../_Utilities";
import type { HandleTemplateVariableInsertionParams } from "./HandleTemplateVariableInsertion-types";

/*
 * Subscribes to insertion requests and inserts a template variable component for the requested
 * field at the cursor, with its display text resolved from the stored values. A field that can't
 * be placed is ignored. Returns a cleanup function.
 */
export const handleTemplateVariableInsertion = ({
	configPort,
	editorAPI,
}: HandleTemplateVariableInsertionParams) => {
	const unsubscribe = configPort.onInsert(({ fieldName }) => {
		const { rootEditable } = editorAPI;

		const { templateVariable: storage } = getRootStorage({ rootEditable });

		const placementMismatch = validateTemplateVariablePlacement({
			fieldName,
			fieldsConfig: configPort.fieldsConfig,
			storage,
		});

		if (placementMismatch) {
			console.warn(placementMismatch);
			return;
		}

		const templateVariable = createTemplateVariable({
			fieldName,
			displayText: storage[fieldName],
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
