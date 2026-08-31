import type {
	GetSelectionForwardTextParams,
	GetSelectionForwardTextResult,
} from "./Utilities-types";

/**
 * Returns the text node that is further forward in the DOM, regardless of selection direction.
 */
export const getSelectionForwardText = ({
	editorAPI,
}: GetSelectionForwardTextParams): GetSelectionForwardTextResult => {
	const selection = editorAPI.getEditorSelection();
	const { fromText, toText } = selection.getBoundaryPoints();
	const { domDirection } = selection;

	const endNode = domDirection === "forward" ? toText : fromText;

	return endNode;
};
