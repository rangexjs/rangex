import type { HandleLineDragStartParams } from "./HandleLineDragStart-types";

/*
 * Wires the drag-handle's drag start to the engine: selects the current line, syncs the native
 * selection, and hands the drag event off to the engine's external-drag flow.
 */
export const handleLineDragStart = ({
	configPort,
	editorAPI,
	getCurrentLine,
}: HandleLineDragStartParams) => {
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = configPort.onDragStart((event) => {
		const currentLine = getCurrentLine();

		if (!currentLine) {
			return;
		}

		if (!event.dataTransfer) {
			return;
		}

		const lineRect = currentLine.getBoundingClientRect();

		event.dataTransfer.setDragImage(
			currentLine,
			event.clientX - lineRect.left,
			event.clientY - lineRect.top,
		);

		selection.setBoundaryPoints({
			fromNode: currentLine,
			fromOffset: 0,
			toNode: currentLine,
			toOffset: currentLine.$$childNodes.length,
		});

		selection.syncToNativeSelection();

		editorAPI.startExternalDrag(event);
	});

	return () => {
		unsubscribe();
	};
};
