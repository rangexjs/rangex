import { componentsName, createBlockComponentPlacement } from "#engine-links";
import {
	getBlockAlign,
	handleBlockAlignState,
	handleBlockResizeAppearance,
	handleCaptionState,
	handleQuickActionsAppearance,
	handleSwapToEmptyMedia,
} from "../_Utilities";
import {
	getEmbedCaption,
	getEmbedFigure,
	setEmbedCaptionEnabled,
	setEmbedCaptionPosition,
} from "./_Utilities";
import type { ConfigureEmbedParams } from "./ConfigureEmbed-types";
import { handleEmbedInsertion } from "./HandleEmbedInsertion";

/*
 * Wires up the embed feature: insertion, quick-actions overlay, resize, alignment, caption and
 * empty-media swap behavior. Returns a cleanup function that tears down all of it.
 */
export const configureEmbed = ({
	configPort,
	editorAPI,
}: ConfigureEmbedParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const insertionCleanup = handleEmbedInsertion({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const { getCurrentBlock, cleanup: quickActionsCleanup } =
		handleQuickActionsAppearance({
			port: configPort,
			quickActionsPort: configPort.quickActions,
			editorAPI,
			componentName: componentsName.embed,
			beforeOpen({ blockComponent }) {
				const { $$parentElement } = blockComponent;

				if (!$$parentElement) {
					throw new Error("ParentElement not supposed to be null.");
				}

				const align = getBlockAlign({ blockComponentLine: $$parentElement });
				const figure = getEmbedFigure({ blockComponent });
				const caption = getEmbedCaption({ figure });

				configPort.updateBlockAlign({ align });
				configPort.updateCaption(caption);
			},
		});

	const resizeAppearanceCleanup = handleBlockResizeAppearance({
		blockResize: configPort.blockResize,
		editorAPI,
		componentName: componentsName.embed,
	});

	const alignStateCleanup = handleBlockAlignState({
		port: configPort,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleCaptionState({
		port: configPort,
		editorAPI,
		getCurrentBlock,
		getFigure: getEmbedFigure,
		getCaption: getEmbedCaption,
		setCaptionEnabled: setEmbedCaptionEnabled,
		setCaptionPosition: setEmbedCaptionPosition,
	});

	const swapCleanup = handleSwapToEmptyMedia({
		port: configPort,
		editorAPI,
		getCurrentBlock,
	});

	return () => {
		insertionCleanup();
		quickActionsCleanup();
		resizeAppearanceCleanup();
		alignStateCleanup();
		captionStateCleanup();
		swapCleanup();
	};
};
