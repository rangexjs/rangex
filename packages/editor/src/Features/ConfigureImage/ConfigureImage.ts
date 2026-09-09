import { componentsName, createBlockComponentPlacement } from "#engine-links";
import {
	getBlockAlign,
	handleBlockAlignState,
	handleBlockResizeAppearance,
	handleCaptionState,
	handleCommitSnapshot,
	handleQuickActionsOverlayAppearance,
	handleSwapToEmptyMedia,
} from "../_Utilities";
import {
	getImageCaption,
	getImageFigure,
	setImageCaptionEnabled,
	setImageCaptionPosition,
} from "./_Utilities";
import type { ConfigureImageParams } from "./ConfigureImage-types";
import { handleImageInsertion } from "./HandleImageInsertion";

export const configureImage = ({
	configPort,
	editorAPI,
}: ConfigureImageParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const commitSnapshotCleanup = handleCommitSnapshot({
		port: configPort,
		editorAPI,
	});

	const insertionCleanup = handleImageInsertion({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const { getCurrentBlock, cleanup: quickActionsCleanup } =
		handleQuickActionsOverlayAppearance({
			port: configPort,
			editorAPI,
			componentName: componentsName.image,
			beforeOpen({ blockComponent }) {
				const { $$parentElement } = blockComponent;

				if (!$$parentElement) {
					throw new Error("ParentElement not supposed to be null.");
				}

				const align = getBlockAlign({ blockComponentLine: $$parentElement });
				const figure = getImageFigure({ blockComponent });
				const caption = getImageCaption({ figure });

				configPort.setAlign(align);
				configPort.setCaption(caption);
			},
		});

	const resizeAppearanceCleanup = handleBlockResizeAppearance({
		blockResize: configPort.blockResize,
		editorAPI,
		componentName: componentsName.image,
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
		getFigure: getImageFigure,
		getCaption: getImageCaption,
		setCaptionEnabled: setImageCaptionEnabled,
		setCaptionPosition: setImageCaptionPosition,
	});

	const swapCleanup = handleSwapToEmptyMedia({
		port: configPort,
		editorAPI,
		getCurrentBlock,
	});

	return () => {
		insertionCleanup();
		quickActionsCleanup();
		commitSnapshotCleanup();
		resizeAppearanceCleanup();
		alignStateCleanup();
		captionStateCleanup();
		swapCleanup();
	};
};
