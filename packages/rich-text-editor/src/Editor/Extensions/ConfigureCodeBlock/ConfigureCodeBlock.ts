import { createBlockComponentPlacement } from "../../BlockComponentPlacement";
import { createOverlayAppearanceHandler } from "../../OverlayAppearanceHandler";
import { CodeHighlighter } from "./CodeHighlighter";
import type { ConfigureCodeBlockParams } from "./ConfigureCodeBlock-types";
import { handleCodeBlockInsertion } from "./HandleCodeBlockInsertion";
import { handleCodeBlockPopoverAppearance } from "./HandleCodeBlockPopoverAppearance";
import { handleCodeBlockPopoverState } from "./HandleCodeBlockPopoverState";
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

	editorPort.popover.mount();

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

	const { getCurrentBlock, cleanup: popoverAppearanceCleanup } =
		handleCodeBlockPopoverAppearance({
			editorPort,
			overlayAppearanceHandler,
		});

	const popoverStateCleanup = handleCodeBlockPopoverState({
		editorPort,
		editorAPI,
		codeHighlighter,
		getCurrentBlock,
	});

	return () => {
		overlayAppearanceHandler.cleanup();
		editorPort.popover.unmount();

		toolbarButtonStateCleanup();
		insertionCleanup();
		lineNumbersCleanup();
		popoverStateCleanup();
		popoverAppearanceCleanup();
	};
};
