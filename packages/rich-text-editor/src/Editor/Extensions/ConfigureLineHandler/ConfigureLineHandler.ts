import { handleInsertRootLine, handleLineDelete } from "../_Utilities";
import type { ConfigureLineHandlerParams } from "./ConfigureLineHandler-types";
import { handleLineDragStart } from "./HandleLineDragStart";
import { handleLineHover } from "./HandleLineHover";

export const configureLineHandler = ({
	editorPort,
	editorAPI,
}: ConfigureLineHandlerParams) => {
	editorPort.popover.mount();

	const { getCurrentLine, cleanup: hoverCleanup } = handleLineHover({
		editorPort,
		editorAPI,
	});

	const deleteCleanup = handleLineDelete({
		port: editorPort,
		editorAPI,
		getCurrentLine,
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

	return () => {
		editorPort.popover.unmount();

		hoverCleanup();
		deleteCleanup();
		insertRootLineCleanup();
		dragStartCleanup();
	};
};
