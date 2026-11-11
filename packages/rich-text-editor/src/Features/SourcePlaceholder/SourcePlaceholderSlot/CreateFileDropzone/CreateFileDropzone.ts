import { createSignal } from "solid-js";

import type {
	CreateFileDropzoneParams,
	CreateFileDropzoneResult,
} from "./CreateFileDropzone-types";

const isFileDrag = (event: DragEvent) => !!event.dataTransfer?.types.includes("Files");

/*
 * Tracks a file being dragged over an element and passes on the dropped one. The returned handlers go on that element.
 */
export const createFileDropzone = ({
	onFile,
}: CreateFileDropzoneParams): CreateFileDropzoneResult => {
	const [dragActive, setDragActive] = createSignal(false);
	// dragenter/dragleave fire on every child crossed too, bubbling — a depth counter is
	// needed to tell "left a child" apart from "left the dropzone entirely".
	let dragDepth = 0;

	const onDragEnter = (event: DragEvent) => {
		if (!isFileDrag(event)) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		dragDepth += 1;
		setDragActive(true);
	};

	const onDragOver = (event: DragEvent) => {
		if (!isFileDrag(event)) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = "copy";
		}
	};

	const onDragLeave = (event: DragEvent) => {
		if (!isFileDrag(event)) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		dragDepth -= 1;

		if (dragDepth <= 0) {
			dragDepth = 0;
			setDragActive(false);
		}
	};

	const onDrop = (event: DragEvent) => {
		if (!isFileDrag(event)) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		dragDepth = 0;
		setDragActive(false);

		const [file] = event.dataTransfer?.files ?? [];

		if (!file) {
			return;
		}

		onFile(file);
	};

	return { dragActive, onDragEnter, onDragOver, onDragLeave, onDrop };
};
