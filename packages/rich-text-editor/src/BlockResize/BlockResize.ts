import type {
	BlockResize,
	BlockResizeInternals,
	CreateBlockResizeParams,
	CreateBlockResizeResult,
} from "./BlockResize-types";
import { handleBlockResizeAppearance } from "./HandleBlockResizeAppearance";
import { handleBlockResizeInteraction } from "./HandleBlockResizeInteraction";

export const createBlockResize = ({
	richTextEditorUI,
	editorAPI,
}: CreateBlockResizeParams): CreateBlockResizeResult => {
	const internals: BlockResizeInternals = {
		currentBlock: null,
		resizableComponentNames: new Set(),
	};

	const appearanceCleanup = handleBlockResizeAppearance({
		richTextEditorUI,
		editorAPI,
		internals,
	});

	const interactionCleanup = handleBlockResizeInteraction({
		richTextEditorUI,
		editorAPI,
		internals,
	});

	const blockResize: BlockResize = {
		registerComponent({ componentName }) {
			internals.resizableComponentNames.add(componentName);
		},

		unregisterComponent({ componentName }) {
			internals.resizableComponentNames.delete(componentName);
		},

		cleanup() {
			appearanceCleanup();
			interactionCleanup();
		},
	};

	return blockResize;
};
