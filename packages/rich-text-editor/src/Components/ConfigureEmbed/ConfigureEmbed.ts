import { componentsName } from "../../Constants";
import type {
	ConfigureEmbedParams,
	EmbedInternals,
} from "./ConfigureEmbed-types";
import { handleEmbedAlignState } from "./HandleEmbedAlignState";
import { handleEmbedAttrState } from "./HandleEmbedAttrState";
import { handleEmbedCaptionState } from "./HandleEmbedCaptionState";
import { handleEmbedDelete } from "./HandleEmbedDelete";
import { handleEmbedInsertion } from "./HandleEmbedInsertion";
import { handleEmbedPopoverAppearance } from "./HandleEmbedPopoverAppearance";
import { handleEmbedSwap } from "./HandleEmbedSwap";
import { handleEmbedSwapPopoverToggle } from "./HandleEmbedSwapPopoverToggle";

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
		handleEmbedPopoverAppearance({
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

	const swapPopoverToggleCleanup = handleEmbedSwapPopoverToggle({
		richTextEditorUI,
		getCurrentBlock,
		internals,
	});

	const swapCleanup = handleEmbedSwap({
		richTextEditorUI,
		editorAPI,
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
		swapPopoverToggleCleanup();
		swapCleanup();
		deleteCleanup();
	};
};
