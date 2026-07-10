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
		registrations: new Map(),
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
		registerComponent({ componentName, handleX }) {
			internals.registrations.set(componentName, { handleX });
		},

		unregisterComponent({ componentName }) {
			internals.registrations.delete(componentName);
		},

		cleanup() {
			appearanceCleanup();
			interactionCleanup();
		},
	};

	return blockResize;
};
