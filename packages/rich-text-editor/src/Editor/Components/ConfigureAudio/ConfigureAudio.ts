import { componentsName } from "../../Constants";
import type {
	AudioInternals,
	ConfigureAudioParams,
} from "./ConfigureAudio-types";
import { handleAudioAlignState } from "./HandleAudioAlignState";
import { handleAudioAttrState } from "./HandleAudioAttrState";
import { handleAudioCaptionState } from "./HandleAudioCaptionState";
import { handleAudioDelete } from "./HandleAudioDelete";
import { handleAudioInsertion } from "./HandleAudioInsertion";
import { handleAudioPopoverAppearance } from "./HandleAudioPopoverAppearance";
import { handleAudioSwap } from "./HandleAudioSwap";
import { handleAudioSwapPopoverToggle } from "./HandleAudioSwapPopoverToggle";

// TODO: file uploads are inlined as base64 data URLs (see uploadMediaFile in
// src/Editor/_Utilities) instead of going through any upload endpoint or blob
// storage. This embeds the full file bytes directly in the document and in every
// snapshot/undo boundary. It works for now but isn't viable long term — needs a pluggable
// upload mechanism (consumer-supplied endpoint/blob storage) eventually.
export const configureAudio = ({
	richTextEditorUI,
	editorAPI,
	blockResize,
	blockPopoverAppearanceHandler,
	onMediaResolve,
}: ConfigureAudioParams) => {
	const internals: AudioInternals = { currentAudioFigure: null };

	const blockResizeCleanup = blockResize.registerComponent({
		handleX: 16,
		canShow({ blockNestedContext }) {
			return blockNestedContext.$$componentName === componentsName.audio;
		},
	});

	const insertionCleanup = handleAudioInsertion({
		editorAPI,
		onMediaResolve,
	});

	const { getCurrentBlock, cleanup: popoverAppearanceCleanup } =
		handleAudioPopoverAppearance({
			richTextEditorUI,
			blockPopoverAppearanceHandler,
		});

	const alignStateCleanup = handleAudioAlignState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const attrStateCleanup = handleAudioAttrState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleAudioCaptionState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const swapPopoverToggleCleanup = handleAudioSwapPopoverToggle({
		richTextEditorUI,
		getCurrentBlock,
		internals,
	});

	const swapCleanup = handleAudioSwap({
		richTextEditorUI,
		editorAPI,
		internals,
	});

	const deleteCleanup = handleAudioDelete({
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
