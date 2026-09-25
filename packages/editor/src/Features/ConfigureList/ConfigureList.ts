import {
	componentsName,
	createBlockComponentPlacement,
	createComponentLookup,
} from "#engine-links";
import { handleComponentUnwrap } from "../_Utilities";
import type { ConfigureListParams } from "./ConfigureList-types";
import { handleListPlacement } from "./HandleListPlacement";
import { handleListPlacementState } from "./HandleListPlacementState";

/*
 * Wires up list toolbar button state and placement handling, returning a cleanup function.
 */
export const configureList = ({
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureListParams) => {
	const componentLookup = createComponentLookup({ editorAPI });
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const placementStateCleanup = handleListPlacementState({
		configPort,
		editorAPI,
		componentLookup,
		blockComponentPlacement,
	});

	const unwrapCleanup = handleComponentUnwrap({
		port: configPort,
		editorAPI,
		getComponent: () =>
			componentLookup.closestBlockBySelection({
				components: [componentsName.list],
			}),
	});

	const placementCleanup = handleListPlacement({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	return () => {
		placementStateCleanup();
		unwrapCleanup();
		placementCleanup();
	};
};
