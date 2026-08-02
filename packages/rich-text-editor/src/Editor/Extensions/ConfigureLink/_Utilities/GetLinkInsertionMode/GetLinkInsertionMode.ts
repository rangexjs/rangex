import { EditorRange } from "rich-text-area";
import { componentsName } from "#ports";
import { getClosestScopedEditable } from "../../../../NodeQuery";
import type {
	GetLinkInsertionModeParams,
	GetLinkInsertionModeResult,
} from "./GetLinkInsertionMode-types";

/**
 * Returns the insertion mode for a Link at the current editor selection, or
 * `null` if insertion is not possible.
 *
 * - `"insert"` — the selection is a single point (collapsed caret). The
 *   closest ScopedEditable must allow the link component.
 *
 * - `"wrap"` — the selection spans multiple points. At least one
 *   InlineWrappableSegment whose closest ScopedEditable allows the link
 *   component must exist and must contain no InlineNestedContext.
 */
export const getLinkInsertionMode = ({
	editorAPI,
}: GetLinkInsertionModeParams): GetLinkInsertionModeResult => {
	const selection = editorAPI.getEditorSelection();

	const { fromText, fromOffset, toText, toOffset } =
		selection.getBoundaryPoints();

	const range = new EditorRange({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	// Collapsed caret — check whether the closest ScopedEditable allows the link component.
	if (range.isSinglePoint) {
		const scopedEditable = getClosestScopedEditable({
			fromNode: range.startText,
		});

		if (!scopedEditable) {
			throw new Error("ScopedEditable can't be null.");
		}

		const { $$allowedComponents } = scopedEditable;

		const isAllowed =
			$$allowedComponents === null ||
			$$allowedComponents.includes(componentsName.link);

		return isAllowed ? "insert" : null;
	}

	const inlineWrappableSegments = editorAPI.getInlineWrappableSegments({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	for (const inlineWrappableSegment of inlineWrappableSegments) {
		const contentLine = inlineWrappableSegment.getContentLine();

		const { $$parentElement } = contentLine;

		if (!$$parentElement) {
			throw new Error("ParentElement can't be null.");
		}

		const { $$allowedComponents } = $$parentElement;

		const isAllowed =
			$$allowedComponents === null ||
			$$allowedComponents.includes(componentsName.link);

		if (!isAllowed) {
			continue;
		}

		const inlineNestedContexts =
			inlineWrappableSegment.getInlineNestedContextListInSegment();

		// Insertion is not allowed if the segment contains InlineNestedContext
		if (inlineNestedContexts.length) {
			continue;
		}

		return "wrap";
	}

	return null;
};
