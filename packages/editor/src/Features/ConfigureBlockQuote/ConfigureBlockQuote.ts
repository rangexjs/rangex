import {
	componentsName,
	createBlockComponentPlacement,
	createComponentLookup,
} from "#engine-links";
import { handleComponentUnwrap } from "../_Utilities";
import type { ConfigureBlockQuoteParams } from "./ConfigureBlockQuote-types";
import { handleBlockQuotePlacement } from "./HandleBlockQuotePlacement";
import { handleBlockQuotePlacementState } from "./HandleBlockQuotePlacementState";

/*
 * Wires up block quote toolbar button state and placement handling, returning a cleanup function.
 */
export const configureBlockQuote = ({
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureBlockQuoteParams) => {
	const componentLookup = createComponentLookup({ editorAPI });
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const placementStateCleanup = handleBlockQuotePlacementState({
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
				components: [componentsName.blockQuote],
			}),
	});

	const placementCleanup = handleBlockQuotePlacement({
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
