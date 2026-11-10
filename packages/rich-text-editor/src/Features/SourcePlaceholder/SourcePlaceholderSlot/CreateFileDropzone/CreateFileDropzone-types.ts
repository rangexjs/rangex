import type { Accessor } from "solid-js";

export interface CreateFileDropzoneParams {
	onFile: (file: File) => void;
}

export interface CreateFileDropzoneResult {
	dragActive: Accessor<boolean>;
	onDragEnter: (event: DragEvent) => void;
	onDragOver: (event: DragEvent) => void;
	onDragLeave: (event: DragEvent) => void;
	onDrop: (event: DragEvent) => void;
}
