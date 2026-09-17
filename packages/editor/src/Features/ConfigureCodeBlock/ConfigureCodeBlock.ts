import {
	codeBlockStorageFallbacks,
	componentsName,
	createBlockComponentPlacement,
	ensureNodeCodeBlockStorage,
} from "#engine-links";
import { handleQuickActionsAppearance } from "../_Utilities";
import { CodeHighlighter } from "./CodeHighlighter";
import type { ConfigureCodeBlockParams } from "./ConfigureCodeBlock-types";
import { handleCodeBlockOverlayState } from "./HandleCodeBlockOverlayState";
import { handleCodeBlockPlacement } from "./HandleCodeBlockPlacement";
import { handleCodeBlockPlacementState } from "./HandleCodeBlockPlacementState";
import { handleLineNumbers } from "./HandleLineNumbers";

/*
 * Wires up the code block component: toolbar button state, insert/wrap placement, line numbers,
 * syntax highlighting, and the quick actions overlay. Returns a cleanup function.
 */
export const configureCodeBlock = ({
	configPort,
	editorAPI,
}: ConfigureCodeBlockParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });
	const codeHighlighter = new CodeHighlighter({
		editorAPI,
		getHighlightInfo: configPort.getHighlightInfo,
	});

	const placementStateCleanup = handleCodeBlockPlacementState({
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

	const { getCurrentBlock, cleanup: quickActionsCleanup } =
		handleQuickActionsAppearance({
			port: configPort,
			quickActionsPort: configPort.quickActions,
			editorAPI,
			componentName: componentsName.codeBlock,
			beforeOpen({ blockComponent }) {
				const storage = ensureNodeCodeBlockStorage({
					blockComponent,
					fallbacks: codeBlockStorageFallbacks,
				});

				configPort.updateState({
					language: storage.language,
					theme: storage.theme ?? configPort.defaultTheme,
				});
			},
		});

	const overlayStateCleanup = handleCodeBlockOverlayState({
		configPort,
		editorAPI,
		codeHighlighter,
		getCurrentBlock,
	});

	return () => {
		placementStateCleanup();
		placementCleanup();
		lineNumbersCleanup();
		overlayStateCleanup();
		quickActionsCleanup();
	};
};
