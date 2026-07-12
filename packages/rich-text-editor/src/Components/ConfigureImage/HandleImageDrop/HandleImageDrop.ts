import { htmlLayoutName, isEditorNode } from "rich-text-area";
import { imagePart } from "../../../Constants";
import { applyImageSrc, readFileAsDataURL } from "../_Utilities";
import type {
	HandleImageDropParams,
	IsImageDropzoneParams,
} from "./HandleImageDrop-types";

const isImageDropzone = ({ element }: IsImageDropzoneParams) =>
	element.matches(imagePart.dropzone.attr);

/**
 * Registers dragover/drop listeners directly on empty image dropzones, letting a user
 * fill an empty image by dragging a file onto it.
 */
export const handleImageDrop = ({ editorAPI }: HandleImageDropParams) => {
	const unsubscribeDragOver = editorAPI.registerDOMEvent({
		when: isImageDropzone,
		eventListener: {
			type: "dragover",
			listener(event) {
				event.preventDefault();
				event.stopPropagation();

				if (event.dataTransfer) {
					event.dataTransfer.dropEffect = "copy";
				}
			},
		},
	});

	const unsubscribeDrop = editorAPI.registerDOMEvent({
		when: isImageDropzone,
		eventListener: {
			type: "drop",
			listener(event) {
				event.preventDefault();
				event.stopPropagation();

				const { currentTarget, dataTransfer } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (currentTarget.$$editorRole !== htmlLayoutName) {
					throw new Error("CurrentTarget's type is invalid.");
				}

				const [file] = dataTransfer?.files ?? [];

				if (!file?.type.startsWith("image/")) {
					return;
				}

				const { $$parentElement: figure } = currentTarget;

				if (
					!figure ||
					figure.$$editorRole !== htmlLayoutName ||
					figure.$$localName !== "figure"
				) {
					throw new Error("Dropzone's parent must be the figure.");
				}

				readFileAsDataURL(file).then((src) => {
					applyImageSrc({ figure, src, editorAPI });
				});
			},
		},
	});

	return () => {
		unsubscribeDragOver();
		unsubscribeDrop();
	};
};
