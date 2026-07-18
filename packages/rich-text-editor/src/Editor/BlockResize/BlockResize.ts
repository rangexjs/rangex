import type {
	BlockResize,
	BlockResizeInternals,
	CreateBlockResizeParams,
	CreateBlockResizeResult,
} from "./BlockResize-types";
import { handleBlockResizeAppearance } from "./HandleBlockResizeAppearance";
import { handleBlockResizeInteraction } from "./HandleBlockResizeInteraction";

export const createBlockResize = ({
	blockResizePort,
	editorAPI,
}: CreateBlockResizeParams): CreateBlockResizeResult => {
	const internals: BlockResizeInternals = {
		currentBlock: null,
		registrations: new Set(),
	};

	const appearanceCleanup = handleBlockResizeAppearance({
		blockResizePort,
		editorAPI,
		internals,
	});

	const interactionCleanup = handleBlockResizeInteraction({
		blockResizePort,
		editorAPI,
		internals,
	});

	const blockResize: BlockResize = {
		registerComponent({ handleX, canShow }) {
			const registration = { handleX, canShow };

			internals.registrations.add(registration);

			return () => {
				internals.registrations.delete(registration);
			};
		},

		cleanup() {
			appearanceCleanup();
			interactionCleanup();
		},
	};

	return blockResize;
};
