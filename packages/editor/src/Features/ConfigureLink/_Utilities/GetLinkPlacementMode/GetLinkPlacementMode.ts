import { EditorRange } from "rich-text-area";
import { componentsName, getClosestScopedEditable } from "#engine-links";
import type {
	GetLinkPlacementModeParams,
	GetLinkPlacementModeResult,
} from "./GetLinkPlacementMode-types";

/**
 * Resolves whether the current selection can take a link, and as which shape: a collapsed
 * caret can only "insert" a brand-new link, a real range can only "wrap" its own text into
 * one. Returns null when neither applies (e.g. inside a link already, or a context whose
 * `$$allowedComponents` excludes links).
 */
export const getLinkPlacementMode = ({
	editorAPI,
}: GetLinkPlacementModeParams): GetLinkPlacementModeResult => {
	const selection = editorAPI.getEditorSelection();

	const { fromText, fromOffset, toText, toOffset } =
		selection.getBoundaryPoints();

	const range = new EditorRange({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	if (range.isSinglePoint) {
		const scopedEditable = getClosestScopedEditable({ fromNode: fromText });

		if (!scopedEditable) {
			return null;
		}

		const { $$allowedComponents } = scopedEditable;

		if (
			!$$allowedComponents ||
			$$allowedComponents.includes(componentsName.link)
		) {
			return "insert";
		}

		return null;
	}

	const segments = editorAPI.getInlineWrappableSegments({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	for (const segment of segments) {
		if (segment.getInlineComponentListInSegment().length > 0) {
			continue;
		}

		const { $$parentElement } = segment.getContentLine();

		if (!$$parentElement) {
			throw new Error("ParentElement can't be null.");
		}

		const { $$allowedComponents } = $$parentElement;

		if (
			!$$allowedComponents ||
			$$allowedComponents.includes(componentsName.link)
		) {
			return "wrap";
		}
	}

	return null;
};
