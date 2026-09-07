import {
	createAnchoredOverlayController,
	createBlockComponentPlacement,
	createOverlayAppearanceHandler,
} from "#engine-links";
import { CodeHighlighter } from "./CodeHighlighter";
import type { ConfigureCodeBlockParams } from "./ConfigureCodeBlock-types";
import { handleCodeBlockOverlayAppearance } from "./HandleCodeBlockOverlayAppearance";
import { handleCodeBlockOverlayState } from "./HandleCodeBlockOverlayState";
import { handleCodeBlockPlacement } from "./HandleCodeBlockPlacement";
import { handleCodeBlockToolbarButtonState } from "./HandleCodeBlockToolbarButtonState";
import { handleLineNumbers } from "./HandleLineNumbers";

export const configureCodeBlock = ({
	configPort,
	editorAPI,
}: ConfigureCodeBlockParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });
	const overlayAppearanceHandler = createOverlayAppearanceHandler({
		editorAPI,
	});
	const codeHighlighter = new CodeHighlighter({ editorAPI });

	const anchorController = createAnchoredOverlayController({
		element: configPort.floatingEl,
		options: {
			onToggle: (isOpen) => configPort.updateState({ isOpen }),
		},
	});

	const toolbarButtonStateCleanup = handleCodeBlockToolbarButtonState({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const placementCleanup = handleCodeBlockPlacement({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const lineNumbersCleanup = handleLineNumbers({ editorAPI });

	const { getCurrentBlock, cleanup: overlayAppearanceCleanup } =
		handleCodeBlockOverlayAppearance({
			configPort,
			overlayAppearanceHandler,
			anchorController,
		});

	const overlayStateCleanup = handleCodeBlockOverlayState({
		configPort,
		editorAPI,
		codeHighlighter,
		getCurrentBlock,
	});

	return () => {
		overlayAppearanceHandler.cleanup();

		toolbarButtonStateCleanup();
		placementCleanup();
		lineNumbersCleanup();
		overlayStateCleanup();
		overlayAppearanceCleanup();
	};
};
