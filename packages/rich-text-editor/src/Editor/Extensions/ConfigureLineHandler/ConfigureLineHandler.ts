import {
	handleBlockLineDuplication,
	handleInsertRootLine,
	handleLineDelete,
} from "../_Utilities";
import type { ConfigureLineHandlerParams } from "./ConfigureLineHandler-types";
import { handleDragMenuState } from "./HandleDragMenuState";
import { handleLineDragStart } from "./HandleLineDragStart";
import { handleLineHover } from "./HandleLineHover";
import { handleLineUnwrap } from "./HandleLineUnwrap";
import { handleTurnInto } from "./HandleTurnInto";

export const configureLineHandler = ({
	editorPort,
	editorAPI,
}: ConfigureLineHandlerParams) => {
	editorPort.anchoredOverlay.mount();

	const onLineChange = handleDragMenuState({ editorPort });

	const { getCurrentLine, cleanup: hoverCleanup } = handleLineHover({
		editorPort,
		editorAPI,
		onLineChange,
	});

	const insertRootLineCleanup = handleInsertRootLine({
		port: editorPort,
		editorAPI,
		getCurrentLine,
	});

	const dragStartCleanup = handleLineDragStart({
		editorPort,
		editorAPI,
		getCurrentLine,
	});

	const turnIntoCleanup = handleTurnInto({
		editorPort,
		editorAPI,
		getCurrentLine,
	});

	const lineUnwrapCleanup = handleLineUnwrap({
		editorPort,
		editorAPI,
		getCurrentLine,
	});

	const duplicateCleanup = handleBlockLineDuplication({
		port: editorPort,
		editorAPI,
		getBlockLine: getCurrentLine,
	});

	const deleteCleanup = handleLineDelete({
		port: editorPort,
		editorAPI,
		getCurrentLine,
	});

	return () => {
		editorPort.anchoredOverlay.unmount();

		hoverCleanup();
		insertRootLineCleanup();
		dragStartCleanup();
		turnIntoCleanup();
		lineUnwrapCleanup();
		duplicateCleanup();
		deleteCleanup();
	};
};
