import { getSelectionForwardText } from "./_Utilities";
import type {
	BlockComponentPlacement,
	CreateBlockComponentPlacementParams,
	CreateBlockComponentPlacementResult,
} from "./BlockComponentPlacement-types";
import { canInsertBlockLines } from "./CanInsertBlockLines";
import { canWrapBlockComponent } from "./CanWrapBlockComponent";
import { insertBlockLines } from "./InsertBlockLines";
import { wrapBlockComponent } from "./WrapBlockComponent";

/**
 * Creates a {@link BlockComponentPlacement} — the API for inserting and wrapping
 * block-level content in the editor.
 *
 * Both insert and wrap operations target the closest {@link ScopedEditable} with
 * `$$display` `"block multi-line"`. Attempting either outside such an area will throw.
 *
 * Each operation has two variants:
 * - Direct — caller supplies the anchor node(s) explicitly.
 * - BySelection — anchor nodes are derived from the current editor selection.
 */
export const createBlockComponentPlacement = ({
	editorAPI,
}: CreateBlockComponentPlacementParams): CreateBlockComponentPlacementResult => {
	const blockComponentPlacement: BlockComponentPlacement = {
		canInsert({ fromNode, allowedComponents }) {
			return canInsertBlockLines({ fromNode, allowedComponents });
		},

		insert({ fromNode, lines, shouldReplaceContentLineIfEmpty = false }) {
			insertBlockLines({
				fromNode,
				lines,
				shouldReplaceContentLineIfEmpty,
			});
		},

		canInsertBySelection({ allowedComponents }) {
			const fromNode = getSelectionForwardText({ editorAPI });

			return canInsertBlockLines({ fromNode, allowedComponents });
		},

		insertBySelection({ lines, shouldReplaceContentLineIfEmpty = false }) {
			const fromNode = getSelectionForwardText({ editorAPI });

			insertBlockLines({
				fromNode,
				lines,
				shouldReplaceContentLineIfEmpty,
			});
		},

		canWrap({ fromNode, fromOffset, toNode, toOffset, allowedComponents }) {
			return canWrapBlockComponent({
				editorAPI,
				fromNode,
				fromOffset,
				toNode,
				toOffset,
				allowedComponents,
			});
		},

		wrap({
			fromNode,
			fromOffset,
			toNode,
			toOffset,
			blockComponentLine,
			target,
		}) {
			wrapBlockComponent({
				editorAPI,
				fromNode,
				fromOffset,
				toNode,
				toOffset,
				blockComponentLine,
				target,
			});
		},

		canWrapBySelection({ allowedComponents }) {
			const selection = editorAPI.getEditorSelection();

			const { fromText, fromOffset, toText, toOffset } =
				selection.getBoundaryPoints();

			return canWrapBlockComponent({
				editorAPI,
				fromNode: fromText,
				fromOffset,
				toNode: toText,
				toOffset,
				allowedComponents,
			});
		},

		wrapBySelection({ blockComponentLine, target }) {
			const selection = editorAPI.getEditorSelection();

			const { fromText, fromOffset, toText, toOffset } =
				selection.getBoundaryPoints();

			wrapBlockComponent({
				editorAPI,
				fromNode: fromText,
				fromOffset,
				toNode: toText,
				toOffset,
				blockComponentLine,
				target,
			});
		},
	};

	return blockComponentPlacement;
};
