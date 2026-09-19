import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleCodeBlockPlacementStateParams } from "./HandleCodeBlockPlacementState-types";

/*
 * Keeps the code block toolbar button's insert/wrap availability and active state in sync with
 * the current selection. Returns a cleanup function.
 */
export const handleCodeBlockPlacementState = ({
	configPort,
	editorAPI,
	componentLookup,
	blockComponentPlacement,
}: HandleCodeBlockPlacementStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.codeBlock],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.codeBlock],
			});

			const codeBlockComponent = componentLookup.closestBlockBySelection({
				components: [componentsName.codeBlock],
			});
			const isActive = codeBlockComponent !== null;

			configPort.updateState({ canInsert, canWrap, isActive });
		},
	});

	return () => {
		unsubscribe();
	};
};
