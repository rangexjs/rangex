import {
	codeBlockStorageFallbacks,
	componentsName,
	createBlockComponentPlacement,
	ensureNodeCodeBlockStorage,
} from "#engine-links";
import { toUILanguage, toUITheme } from "#libs";
import { handleQuickActionsOverlayAppearance } from "../_Utilities";
import { CodeHighlighter } from "./CodeHighlighter";
import type { ConfigureCodeBlockParams } from "./ConfigureCodeBlock-types";
import { handleCodeBlockOverlayState } from "./HandleCodeBlockOverlayState";
import { handleCodeBlockPlacement } from "./HandleCodeBlockPlacement";
import { handleCodeBlockToolbarButtonState } from "./HandleCodeBlockToolbarButtonState";
import { handleLineNumbers } from "./HandleLineNumbers";

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
		handleQuickActionsOverlayAppearance({
			port: configPort,
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
