import type { HandleEmptyMediaDragOverrideParams } from "./HandleEmptyMediaDragOverride-types";

const isExternalFileDrag = (event: DragEvent) =>
	!!event.dataTransfer?.types.includes("Files");

/**
 * RangeX's own drag handling exists to reorder content within the editor (dragging one of
 * its own blocks) and by default runs for every dragenter/dragover/dragleave/drop event
 * bubbling through the editable area — including ones landing on `EmptyMediaSlot`'s own
 * dropzone, since it's composed into the editable tree through the `DetachedContext` slot.
 * That swallows the event before the dropzone's own listeners get a chance at it. An external
 * OS file drag always carries a "Files" entry in `dataTransfer.types` (an internal content
 * drag never does), so that's used to cancel engine handling only for genuine file drops.
 */
export const handleEmptyMediaDragOverride = ({
	editorAPI,
}: HandleEmptyMediaDragOverrideParams) => {
	const unregisterDragEnter = editorAPI.registerEventInterceptor({
		type: "dragenter",
		interceptor: isExternalFileDrag,
	});

	const unregisterDragOver = editorAPI.registerEventInterceptor({
		type: "dragover",
		interceptor: isExternalFileDrag,
	});

	const unregisterDragLeave = editorAPI.registerEventInterceptor({
		type: "dragleave",
		interceptor: isExternalFileDrag,
	});

	const unregisterDrop = editorAPI.registerEventInterceptor({
		type: "drop",
		interceptor: isExternalFileDrag,
	});

	return () => {
		unregisterDragEnter();
		unregisterDragOver();
		unregisterDragLeave();
		unregisterDrop();
	};
};
