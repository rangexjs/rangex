import { componentsName } from "../../Constants";
import {
	handleBlockAlignState,
	handleBlockDelete,
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
	embedPort,
	editorAPI,
	blockResize,
	blockPopoverAppearanceHandler,
	onMediaResolve,
}: ConfigureEmbedParams) => {
	const internals: EmbedInternals = { currentEmbedFigure: null };

	const blockResizeCleanup = blockResize.registerComponent({
		handleX: 16,
		canShow({ blockNestedContext }) {
			return blockNestedContext.$$componentName === componentsName.embed;
		},
	});

	const insertionCleanup = handleEmbedInsertion({
		editorAPI,
		onMediaResolve,
	});

	const { getCurrentBlock, cleanup: popoverAppearanceCleanup } =
		handleEmbedPopoverAppearance({
			embedPort,
			blockPopoverAppearanceHandler,
		});

	const alignStateCleanup = handleBlockAlignState({
		port: embedPort,
		editorAPI,
		getCurrentBlock,
	});

	const attrStateCleanup = handleEmbedAttrState({
		embedPort,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleCaptionState({
		port: embedPort,
		editorAPI,
		getCurrentBlock,
		getFigure: getEmbedFigure,
		getCaption: getEmbedCaption,
		setCaptionEnabled: setEmbedCaptionEnabled,
		setCaptionPosition: setEmbedCaptionPosition,
	});

	const swapPopoverToggleCleanup = handleEmbedSwapPopoverToggle({
		embedPort,
		getCurrentBlock,
		internals,
	});

	const swapCleanup = handleEmbedSwap({
		embedPort,
		editorAPI,
		internals,
	});

	const deleteCleanup = handleBlockDelete({
		port: embedPort,
		editorAPI,
		getCurrentBlock,
	});

	return () => {
		blockResizeCleanup();
		insertionCleanup();
		popoverAppearanceCleanup();
		alignStateCleanup();
		attrStateCleanup();
		captionStateCleanup();
		swapPopoverToggleCleanup();
		swapCleanup();
		deleteCleanup();
	};
};
