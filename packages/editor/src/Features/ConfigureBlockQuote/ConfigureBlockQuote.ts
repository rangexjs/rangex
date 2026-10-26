import { componentsName } from "#constants";
import { createBlockComponentPlacement } from "#engine-links";
import { handleComponentUnwrap, handleSelectionComponent } from "../_Utilities";
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
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const selectionComponentCleanup = handleSelectionComponent({
		port: configPort,
		editorAPI,
		componentName: componentsName.blockQuote,
	});

	const placementStateCleanup = handleBlockQuotePlacementState({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const unwrapCleanup = handleComponentUnwrap({
		port: configPort,
		editorAPI,
		getComponent: () => configPort.currentComponent,
	});

	const placementCleanup = handleBlockQuotePlacement({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	return () => {
		selectionComponentCleanup();
		placementStateCleanup();
		unwrapCleanup();
		placementCleanup();
	};
};
