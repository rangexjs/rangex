import { componentsName } from "#constants";
import { createBlockComponentPlacement } from "#engine-links";
import {
	handleComponentUnwrap,
	handleQuickActionsAppearance,
	handleSelectionComponent,
} from "../_Utilities";
import { CodeHighlighter } from "./CodeHighlighter";
import type { ConfigureCodeBlockParams } from "./ConfigureCodeBlock-types";
import { handleCodeBlockPlacement } from "./HandleCodeBlockPlacement";
import { handleCodeBlockPlacementState } from "./HandleCodeBlockPlacementState";
import { handleCodeBlockState } from "./HandleCodeBlockState";
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
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});
	const codeHighlighter = new CodeHighlighter({
		editorAPI,
		getHighlightInfo: configPort.getHighlightInfo,
	});

	const selectionComponentCleanup = handleSelectionComponent({
		port: configPort,
		editorAPI,
		componentName: componentsName.codeBlock,
	});

	const placementStateCleanup = handleCodeBlockPlacementState({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const unwrapCleanup = handleComponentUnwrap({
		port: configPort,
		editorAPI,
		getComponent: () => configPort.currentComponent,
	});

	const placementCleanup = handleCodeBlockPlacement({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const lineNumbersCleanup = handleLineNumbers({ editorAPI });

	const quickActionsCleanup = handleQuickActionsAppearance({
		port: configPort,
		quickActionsPort: configPort.quickActions,
		editorAPI,
		componentName: componentsName.codeBlock,
	});

	const codeBlockStateCleanup = handleCodeBlockState({
		configPort,
		editorAPI,
		codeHighlighter,
	});

	return () => {
		selectionComponentCleanup();
		placementStateCleanup();
		unwrapCleanup();
		placementCleanup();
		lineNumbersCleanup();
		codeBlockStateCleanup();
		quickActionsCleanup();
		codeHighlighter.cleanup();
	};
};
