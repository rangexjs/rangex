import {
	codeBlockStorageFallbacks,
	componentsName,
	createBlockComponentPlacement,
	ensureNodeCodeBlockStorage,
} from "#engine-links";
import { toUILanguage, toUITheme } from "#libs";
import { handleQuickActionsAppearance } from "../_Utilities";
import { CodeHighlighter } from "./CodeHighlighter";
import type { ConfigureCodeBlockParams } from "./ConfigureCodeBlock-types";
import { handleCodeBlockOverlayState } from "./HandleCodeBlockOverlayState";
import { handleCodeBlockPlacement } from "./HandleCodeBlockPlacement";
import { handleCodeBlockToolbarButtonState } from "./HandleCodeBlockToolbarButtonState";
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
	const codeHighlighter = new CodeHighlighter({ editorAPI });

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

	const { getCurrentBlock, cleanup: quickActionsCleanup } =
		handleQuickActionsAppearance({
			port: configPort,
			quickActionsPort: configPort.quickActions,
			editorAPI,
			componentName: componentsName.codeBlock,
			beforeOpen({ blockComponent }) {
				const { lang, theme } = ensureNodeCodeBlockStorage({
					blockComponent,
					fallbacks: codeBlockStorageFallbacks,
				});

				configPort.updateState({
					language: toUILanguage(lang),
					lightTheme: toUITheme(theme.light),
					darkTheme: toUITheme(theme.dark),
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
		toolbarButtonStateCleanup();
		placementCleanup();
		lineNumbersCleanup();
		overlayStateCleanup();
		quickActionsCleanup();
	};
};
