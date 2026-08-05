import { createAnchoredOverlayController } from "../../_Utilities";
import { createBlockComponentPlacement } from "../../BlockComponentPlacement";
import { createOverlayAppearanceHandler } from "../../OverlayAppearanceHandler";
import { CodeHighlighter } from "./CodeHighlighter";
import type { ConfigureCodeBlockParams } from "./ConfigureCodeBlock-types";
import { handleCodeBlockInsertion } from "./HandleCodeBlockInsertion";
import { handleCodeBlockOverlayAppearance } from "./HandleCodeBlockOverlayAppearance";
import { handleCodeBlockOverlayState } from "./HandleCodeBlockOverlayState";
import { handleCodeBlockToolbarButtonState } from "./HandleCodeBlockToolbarButtonState";
import { handleLineNumbers } from "./HandleLineNumbers";

export const configureCodeBlock = ({
	editorPort,
	editorAPI,
}: ConfigureCodeBlockParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });
	const overlayAppearanceHandler = createOverlayAppearanceHandler({
		editorAPI,
	});
	const codeHighlighter = new CodeHighlighter({ editorAPI });

	editorPort.anchoredOverlay.mount();

	const anchorController = createAnchoredOverlayController({
		element: editorPort.anchoredOverlay.element,
		options: {
			onToggle: (isOpen) => editorPort.updateState({ isOpen }),
		},
	});

	const toolbarButtonStateCleanup = handleCodeBlockToolbarButtonState({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleCodeBlockInsertion({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	const lineNumbersCleanup = handleLineNumbers({ editorAPI });

	const { getCurrentBlock, cleanup: overlayAppearanceCleanup } =
		handleCodeBlockOverlayAppearance({
			editorPort,
			overlayAppearanceHandler,
			anchorController,
		});

	const overlayStateCleanup = handleCodeBlockOverlayState({
		editorPort,
		editorAPI,
		codeHighlighter,
		getCurrentBlock,
	});

	return () => {
		overlayAppearanceHandler.cleanup();
		editorPort.anchoredOverlay.unmount();

		toolbarButtonStateCleanup();
		insertionCleanup();
		lineNumbersCleanup();
		overlayStateCleanup();
		overlayAppearanceCleanup();
	};
};
