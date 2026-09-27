import { editorSelectionChangeEventType } from "rich-text-area";
import { createComponentLookup } from "#engine-links";
import type { HandleSelectionComponentParams } from "./HandleSelectionComponent-types";

/*
 * Tracks the block or inline component containing the whole selection as the port's selection component,
 * keeping it in sync on every selection change. Returns a cleanup function.
 */
export const handleSelectionComponent = ({
	port,
	editorAPI,
	componentName,
}: HandleSelectionComponentParams) => {
	const componentLookup = createComponentLookup({ editorAPI });

	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const selectionComponent = componentLookup.closestBySelection({
				components: [componentName],
			});

			port.updateCurrentComponent({ selectionComponent });
		},
	});

	return () => {
		unsubscribe();
	};
};
