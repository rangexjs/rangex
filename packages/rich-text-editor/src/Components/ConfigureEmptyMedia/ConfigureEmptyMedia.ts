import type {
	ConfigureEmptyMediaParams,
	ConfigureEmptyMediaResult,
} from "./ConfigureEmptyMedia-types";
import { handleEmptyMediaInsertion } from "./HandleEmptyMediaInsertion";
import { handleEmptyMediaToolbarButtonState } from "./HandleEmptyMediaToolbarButtonState";
import { watchEmptyMedia } from "./WatchEmptyMedia";

export const configureEmptyMedia = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: ConfigureEmptyMediaParams): ConfigureEmptyMediaResult => {
	const toolbarButtonStateCleanup = handleEmptyMediaToolbarButtonState({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleEmptyMediaInsertion({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	const { cleanup: watchCleanup, onMediaResolve } = watchEmptyMedia({
		richTextEditorUI,
		editorAPI,
	});

	return {
		cleanup: () => {
			toolbarButtonStateCleanup();
			insertionCleanup();
			watchCleanup();
		},
		onMediaResolve,
	};
};
