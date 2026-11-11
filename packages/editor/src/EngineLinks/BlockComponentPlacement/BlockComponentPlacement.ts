import { getSelectionForwardText } from "./_Utilities";
import type {
	BlockComponentPlacement,
	CreateBlockComponentPlacementParams,
	CreateBlockComponentPlacementResult,
} from "./BlockComponentPlacement-types";
import { canInsertBlockLines } from "./CanInsertBlockLines";
import { canWrapBlockComponent } from "./CanWrapBlockComponent";
import { hasComponentAdapters } from "./HasComponentAdapters";
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
 *
 * Every `can*` check also returns `false` when an allowed component's Adapter isn't registered on
 * the AdapterBus, so nothing offers a component the editor wasn't built with.
 */
export const createBlockComponentPlacement = ({
	editorAPI,
	adapterBus,
}: CreateBlockComponentPlacementParams): CreateBlockComponentPlacementResult => {
	const blockComponentPlacement: BlockComponentPlacement = {
		canInsert({ fromNode, scope, allowedComponents }) {
			if (!hasComponentAdapters({ adapterBus, allowedComponents })) {
				return false;
			}

			return canInsertBlockLines({ fromNode, scope, allowedComponents });
		},

		insert({ fromNode, lines, shouldReplaceContentLineIfEmpty = false }) {
			insertBlockLines({
				fromNode,
				lines,
				shouldReplaceContentLineIfEmpty,
			});
		},

		canInsertBySelection({ scope, allowedComponents }) {
			if (!hasComponentAdapters({ adapterBus, allowedComponents })) {
				return false;
			}

			const fromNode = getSelectionForwardText({ editorAPI });

			return canInsertBlockLines({ fromNode, scope, allowedComponents });
		},

		insertBySelection({ lines, shouldReplaceContentLineIfEmpty = false }) {
			const fromNode = getSelectionForwardText({ editorAPI });

			insertBlockLines({
				fromNode,
				lines,
				shouldReplaceContentLineIfEmpty,
			});
		},

		canWrap({ fromNode, fromOffset, toNode, toOffset, scope, allowedComponents }) {
			if (!hasComponentAdapters({ adapterBus, allowedComponents })) {
				return false;
			}

			return canWrapBlockComponent({
				editorAPI,
				fromNode,
				fromOffset,
				toNode,
				toOffset,
				scope,
				allowedComponents,
			});
		},

		wrap({ fromNode, fromOffset, toNode, toOffset, blockComponentLine, target }) {
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

		canWrapBySelection({ scope, allowedComponents }) {
			if (!hasComponentAdapters({ adapterBus, allowedComponents })) {
				return false;
			}

			const selection = editorAPI.getEditorSelection();

			const { fromText, fromOffset, toText, toOffset } = selection.getBoundaryPoints();

			return canWrapBlockComponent({
				editorAPI,
				fromNode: fromText,
				fromOffset,
				toNode: toText,
				toOffset,
				scope,
				allowedComponents,
			});
		},

		wrapBySelection({ blockComponentLine, target }) {
			const selection = editorAPI.getEditorSelection();

			const { fromText, fromOffset, toText, toOffset } = selection.getBoundaryPoints();

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
