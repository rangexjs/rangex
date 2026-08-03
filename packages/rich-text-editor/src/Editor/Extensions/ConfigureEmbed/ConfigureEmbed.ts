import { componentsName } from "#ports";
import { createOverlayAppearanceHandler } from "../../OverlayAppearanceHandler";
import {
	handleBlockAlignState,
	handleBlockDelete,
	handleBlockResizeAppearance,
	handleCaptionState,
} from "../_Utilities";
import {
	getEmbedCaption,
	getEmbedFigure,
	setEmbedCaptionEnabled,
	setEmbedCaptionPosition,
} from "./_Utilities";
import type {
	ConfigureEmbedParams,
	EmbedInternals,
} from "./ConfigureEmbed-types";
import { handleEmbedAttrState } from "./HandleEmbedAttrState";
import { handleEmbedInsertion } from "./HandleEmbedInsertion";
import { handleEmbedPopoverAppearance } from "./HandleEmbedPopoverAppearance";
import { handleEmbedSwap } from "./HandleEmbedSwap";
import { handleEmbedSwapPopoverToggle } from "./HandleEmbedSwapPopoverToggle";

export const configureEmbed = ({
	editorPort,
	editorAPI,
}: ConfigureEmbedParams) => {
	const internals: EmbedInternals = { currentEmbedFigure: null };
	const overlayAppearanceHandler = createOverlayAppearanceHandler({
		editorAPI,
	});

	editorPort.popover.mount();
	editorPort.blockResize.mount();

	const insertionCleanup = handleEmbedInsertion({ editorPort, editorAPI });

	const { getCurrentBlock, cleanup: popoverAppearanceCleanup } =
		handleEmbedPopoverAppearance({ editorPort, overlayAppearanceHandler });

	const resizeAppearanceCleanup = handleBlockResizeAppearance({
		blockResize: editorPort.blockResize,
		editorAPI,
		componentName: componentsName.embed,
	});

	const alignStateCleanup = handleBlockAlignState({
		port: editorPort,
		editorAPI,
		getCurrentBlock,
	});

	const attrStateCleanup = handleEmbedAttrState({
		editorPort,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleCaptionState({
		port: editorPort,
		editorAPI,
		getCurrentBlock,
		getFigure: getEmbedFigure,
		getCaption: getEmbedCaption,
		setCaptionEnabled: setEmbedCaptionEnabled,
		setCaptionPosition: setEmbedCaptionPosition,
	});

	const swapPopoverToggleCleanup = handleEmbedSwapPopoverToggle({
		editorPort,
		getCurrentBlock,
		internals,
	});

	const swapCleanup = handleEmbedSwap({ editorPort, editorAPI, internals });

	const deleteCleanup = handleBlockDelete({
		port: editorPort,
		editorAPI,
		getCurrentBlock,
	});

	return () => {
		overlayAppearanceHandler.cleanup();
		editorPort.popover.unmount();
		editorPort.blockResize.unmount();

		insertionCleanup();
		popoverAppearanceCleanup();
		resizeAppearanceCleanup();
		alignStateCleanup();
		attrStateCleanup();
		captionStateCleanup();
		swapPopoverToggleCleanup();
		swapCleanup();
		deleteCleanup();
	};
};
