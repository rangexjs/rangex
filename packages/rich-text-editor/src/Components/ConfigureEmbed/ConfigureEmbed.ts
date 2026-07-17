import { componentsName } from "../../Constants";
import type {
	ConfigureEmbedParams,
	EmbedInternals,
} from "./ConfigureEmbed-types";
import { handleEmbedAlignState } from "./HandleEmbedAlignState";
import { handleEmbedAttrState } from "./HandleEmbedAttrState";
import { handleEmbedCaptionState } from "./HandleEmbedCaptionState";
import { handleEmbedDelete } from "./HandleEmbedDelete";
import { handleEmbedEditPopoverAppearance } from "./HandleEmbedEditPopoverAppearance";
import { handleEmbedInsertion } from "./HandleEmbedInsertion";
import { handleEmbedSwap } from "./HandleEmbedSwap";
import { handleEmbedSwapButtonOpen } from "./HandleEmbedSwapButtonOpen";
import { handleEmbedSwapPopoverClose } from "./HandleEmbedSwapPopoverClose";

export const configureEmbed = ({
	richTextEditorUI,
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
		handleEmbedEditPopoverAppearance({
			richTextEditorUI,
			blockPopoverAppearanceHandler,
		});

	const alignStateCleanup = handleEmbedAlignState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const attrStateCleanup = handleEmbedAttrState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleEmbedCaptionState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const swapButtonOpenCleanup = handleEmbedSwapButtonOpen({
		richTextEditorUI,
		getCurrentBlock,
		internals,
	});

	const swapCleanup = handleEmbedSwap({
		richTextEditorUI,
		editorAPI,
		internals,
	});

	const swapPopoverCloseCleanup = handleEmbedSwapPopoverClose({
		richTextEditorUI,
		internals,
	});

	const deleteCleanup = handleEmbedDelete({
		richTextEditorUI,
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
		swapButtonOpenCleanup();
		swapCleanup();
		swapPopoverCloseCleanup();
		deleteCleanup();
	};
};
