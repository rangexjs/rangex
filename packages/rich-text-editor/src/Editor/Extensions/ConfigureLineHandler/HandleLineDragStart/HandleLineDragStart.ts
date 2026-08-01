import type { HandleLineDragStartParams } from "./HandleLineDragStart-types";

export const handleLineDragStart = ({
	editorPort,
	editorAPI,
	getCurrentLine,
}: HandleLineDragStartParams) => {
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = editorPort.onDragStart((event) => {
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
