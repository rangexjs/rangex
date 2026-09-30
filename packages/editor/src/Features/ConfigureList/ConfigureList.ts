import { componentsName, createBlockComponentPlacement } from "#engine-links";
import { handleComponentUnwrap, handleSelectionComponent } from "../_Utilities";
import type { ConfigureListParams } from "./ConfigureList-types";
import { handleListPlacement } from "./HandleListPlacement";
import { handleListPlacementState } from "./HandleListPlacementState";
import { handleListState } from "./HandleListState";

/*
 * Wires up list toolbar button state and placement handling, returning a cleanup function.
 */
export const configureList = ({
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureListParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const selectionComponentCleanup = handleSelectionComponent({
		port: configPort,
		editorAPI,
		componentName: componentsName.list,
	});

	const placementStateCleanup = handleListPlacementState({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const listStateCleanup = handleListState({ configPort, editorAPI });

	const unwrapCleanup = handleComponentUnwrap({
		port: configPort,
		editorAPI,
		getComponent: () => configPort.currentComponent,
	});

	const placementCleanup = handleListPlacement({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	return () => {
		selectionComponentCleanup();
		placementStateCleanup();
		unwrapCleanup();
		placementCleanup();
		listStateCleanup();
	};
};
