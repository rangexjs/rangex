import type {
	BlockResize,
	BlockResizeInternals,
	CreateBlockResizeParams,
	CreateBlockResizeResult,
	RegisterResizableComponentParams,
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
		registerResizableComponent({
			componentName,
		}: RegisterResizableComponentParams) {
			internals.resizableComponentNames.add(componentName);
		},

		cleanup() {
			appearanceCleanup();
			interactionCleanup();
		},
	};

	return blockResize;
};
