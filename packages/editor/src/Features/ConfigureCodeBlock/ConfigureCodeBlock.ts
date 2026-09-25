import {
	codeBlockStorageFallbacks,
	componentsName,
	createBlockComponentPlacement,
	createComponentLookup,
	ensureNodeCodeBlockStorage,
} from "#engine-links";
import {
	handleComponentUnwrap,
	handleQuickActionsAppearance,
} from "../_Utilities";
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
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureCodeBlockParams) => {
	const componentLookup = createComponentLookup({ editorAPI });
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});
	const codeHighlighter = new CodeHighlighter({
		editorAPI,
		getHighlightInfo: configPort.getHighlightInfo,
	});

	const placementStateCleanup = handleCodeBlockPlacementState({
		configPort,
		editorAPI,
		componentLookup,
		blockComponentPlacement,
	});

	const unwrapCleanup = handleComponentUnwrap({
		port: configPort,
		editorAPI,
		getComponent: () =>
			componentLookup.closestBlockBySelection({
				components: [componentsName.codeBlock],
			}),
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
					theme: storage.theme,
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
		unwrapCleanup();
		placementCleanup();
		lineNumbersCleanup();
		overlayStateCleanup();
		quickActionsCleanup();
	};
};
