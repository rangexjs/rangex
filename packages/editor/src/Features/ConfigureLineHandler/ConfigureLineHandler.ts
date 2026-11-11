import { createBlockComponentPlacement } from "#engine-links";
import {
	handleBlockLineDuplication,
	handleInsertRootLine,
	handleLineRemove,
} from "../_Utilities";
import type { ConfigureLineHandlerParams } from "./ConfigureLineHandler-types";
import { handleDragMenuState } from "./HandleDragMenuState";
import { handleLineDragStart } from "./HandleLineDragStart";
import { handleLineHover } from "./HandleLineHover";
import { handleLineUnwrap } from "./HandleLineUnwrap";
import { handleTurnInto } from "./HandleTurnInto";

/*
 * Wires the line-handler drag handle to the engine: hover tracking, turn-into availability,
 * drag start, turn into, unwrap, duplicate, and remove. Returns a cleanup function that tears
 * down all of it.
 */
export const configureLineHandler = ({
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureLineHandlerParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const onLineChange = handleDragMenuState({
		configPort,
		blockComponentPlacement,
	});

	const { getCurrentLine, cleanup: hoverCleanup } = handleLineHover({
		configPort,
		editorAPI,
		onLineChange,
	});

	const insertRootLineCleanup = handleInsertRootLine({
		port: configPort,
		editorAPI,
		getCurrentLine,
	});

	const dragStartCleanup = handleLineDragStart({
		configPort,
		editorAPI,
		getCurrentLine,
	});

	const turnIntoCleanup = handleTurnInto({
		adapterBus,
		configPort,
		editorAPI,
		blockComponentPlacement,
		getCurrentLine,
	});

	const lineUnwrapCleanup = handleLineUnwrap({
		configPort,
		editorAPI,
		getCurrentLine,
	});

	const duplicateCleanup = handleBlockLineDuplication({
		port: configPort,
		editorAPI,
		getBlockLine: getCurrentLine,
	});

	const removeCleanup = handleLineRemove({
		port: configPort,
		editorAPI,
		getCurrentLine,
	});

	return () => {
		hoverCleanup();
		insertRootLineCleanup();
		dragStartCleanup();
		turnIntoCleanup();
		lineUnwrapCleanup();
		duplicateCleanup();
		removeCleanup();
	};
};
