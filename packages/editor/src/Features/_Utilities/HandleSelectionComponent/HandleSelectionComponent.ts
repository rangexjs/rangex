import { createComponentLookup } from "#engine-links";
import { handleComponentPlacementState } from "../HandleComponentPlacementState";
import type { HandleSelectionComponentParams } from "./HandleSelectionComponent-types";

/*
 * Tracks the block or inline component containing the whole selection as the port's selection component,
 * keeping it in sync on every selection change and structural change. Returns a cleanup function.
 */
export const handleSelectionComponent = ({
	port,
	editorAPI,
	componentName,
}: HandleSelectionComponentParams) => {
	const componentLookup = createComponentLookup({ editorAPI });

	return handleComponentPlacementState({
		editorAPI,
		updateState: () => {
			const selectionComponent = componentLookup.closestBySelection({
				components: [componentName],
			});

			port.updateCurrentComponent({ selectionComponent });
		},
	});
};
