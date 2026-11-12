import { editorSelectionChangeEventType } from "@rangex/core";

import { componentsName } from "#constants";

import type { HandleSourcePlaceholderPlacementStateParams } from "./HandleSourcePlaceholderPlacementState-types";

/*
 * Keeps the source placeholder toolbar button's insert availability in sync with the current
 * selection. Returns a cleanup function.
 */
export const handleSourcePlaceholderPlacementState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleSourcePlaceholderPlacementStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.sourcePlaceholder],
			});

			configPort.updateState({ canInsert });
		},
	});

	return () => {
		unsubscribe();
	};
};
