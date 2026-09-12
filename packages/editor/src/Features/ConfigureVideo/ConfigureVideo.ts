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
	getVideoCaption,
	getVideoFigure,
	setVideoCaptionEnabled,
	setVideoCaptionPosition,
} from "./_Utilities";
import type { ConfigureVideoParams } from "./ConfigureVideo-types";
import { handleVideoInsertion } from "./HandleVideoInsertion";

/*
 * Wires up the video feature: insertion, quick-actions overlay, resize, alignment, caption and
 * empty-media swap behavior. Returns a cleanup function that tears down all of it.
 */
export const configureVideo = ({
	configPort,
	editorAPI,
}: ConfigureVideoParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const commitSnapshotCleanup = handleCommitSnapshot({
		port: configPort,
		editorAPI,
	});

	const insertionCleanup = handleVideoInsertion({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const { getCurrentBlock, cleanup: quickActionsCleanup } =
		handleQuickActionsOverlayAppearance({
			port: configPort,
			editorAPI,
			componentName: componentsName.video,
			beforeOpen({ blockComponent }) {
				const { $$parentElement } = blockComponent;

				if (!$$parentElement) {
					throw new Error("ParentElement not supposed to be null.");
				}

				const align = getBlockAlign({ blockComponentLine: $$parentElement });
				const figure = getVideoFigure({ blockComponent });
				const caption = getVideoCaption({ figure });

				configPort.setAlign(align);
				configPort.setCaption(caption);
			},
		});

	const resizeAppearanceCleanup = handleBlockResizeAppearance({
		blockResize: configPort.blockResize,
		editorAPI,
		componentName: componentsName.video,
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
		getFigure: getVideoFigure,
		getCaption: getVideoCaption,
		setCaptionEnabled: setVideoCaptionEnabled,
		setCaptionPosition: setVideoCaptionPosition,
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
