import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleBlockQuotePlacementStateParams } from "./HandleBlockQuotePlacementState-types";

/*
 * Updates the block quote toolbar button's enabled state on every selection change,
 * based on whether a block quote can be inserted or the selection wrapped in one.
 * Also reports whether the selection is inside the component.
 */
export const handleBlockQuotePlacementState = ({
	configPort,
	editorAPI,
	componentLookup,
	blockComponentPlacement,
}: HandleBlockQuotePlacementStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.blockQuote],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.blockQuote],
			});

			const closestComponent = componentLookup.closestBlockBySelection({
				components: [componentsName.blockQuote],
			});
			const isActive = closestComponent !== null;

			configPort.updateState({ canInsert, canWrap, isActive });
		},
	});

	return () => {
		unsubscribe();
	};
};
