import {
	createContentLine,
	createFormattableTexts,
	createInlineNestedContext,
	createNestedEditable,
} from "rich-text-area";
import { ensureRootEditableStorage } from "../../../_Utilities";
import { componentsName } from "../../../Constants";
import {
	getTemplateVariableQuery,
	resolveTemplateVariableDisplayText,
} from "../_Utilities";
import {
	createTemplateVariableNodeData,
	ensureTemplateVariableStorage,
} from "../TemplateVariableStorage";
import type {
	CreateTemplateVariableComponentParams,
	CreateTemplateVariableComponentResult,
	HandleTemplateVariablePopoverInsertionParams,
	RemoveTemplateVariableQueryTextParams,
	RemoveTemplateVariableQueryTextResult,
} from "./HandleTemplateVariablePopoverInsertion-types";

/**
 * Removes the {{query text (e.g. "{{FirstName") that triggered the popover, before the component is inserted.
 */
const removeTemplateVariableQueryText = ({
	editorAPI,
}: RemoveTemplateVariableQueryTextParams): RemoveTemplateVariableQueryTextResult => {
	const selection = editorAPI.getEditorSelection();

	const { fromText, fromOffset } = selection.getBoundaryPoints();

	const templateVariableQuery = getTemplateVariableQuery({
		editorAPI,
		fromText,
		fromOffset,
	});

	if (!templateVariableQuery) {
		return { queryFound: false };
	}

	const { toText, toOffset } = templateVariableQuery;

	editorAPI.removeNodesInRange({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	return { queryFound: true };
};

const createTemplateVariableComponent = ({
	type,
	displayText,
}: CreateTemplateVariableComponentParams): CreateTemplateVariableComponentResult => {
	return createInlineNestedContext({
		componentName: componentsName.templateVariable,
		content: { type: "custom" },
		editState: "false",
		shouldSelectOnNavigation: true,
		customStorage: createTemplateVariableNodeData({ type }),
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

/**
 * Subscribes to template variable popover selection and inserts the component at the cursor.
 * On select, strips the {{query text first, then re-reads the cursor position and inserts there.
 */
export const handleTemplateVariablePopoverInsertion = ({
	richTextEditorUI,
	editorAPI,
}: HandleTemplateVariablePopoverInsertionParams) => {
	const { templateVariablePopover } = richTextEditorUI;

	const selection = editorAPI.getEditorSelection();

	const unsubscribe = templateVariablePopover.onSelect(({ kind }) => {
		const { queryFound } = removeTemplateVariableQueryText({ editorAPI });

		if (!queryFound) {
			console.warn(
				"handleTemplateVariablePopoverInsertion: no {{query found at cursor — item was selected but the trigger text could not be located.",
			);
			return;
		}

		const { fromText, fromOffset } = selection.getBoundaryPoints();

		const rootEditableStorage = ensureRootEditableStorage({
			rootEditable: editorAPI.rootEditable,
		});
		const storage = ensureTemplateVariableStorage({ rootEditableStorage });
		const displayText = resolveTemplateVariableDisplayText({
			type: kind,
			storage,
		});

		const templateVariable = createTemplateVariableComponent({
			type: kind,
			displayText,
		});

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
