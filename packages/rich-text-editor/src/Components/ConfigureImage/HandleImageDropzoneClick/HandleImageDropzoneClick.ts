import { htmlLayoutName, isEditorNode } from "rich-text-area";
import { imagePart } from "../../../Constants";
import { showImageSwapPopover } from "../_Utilities";
import type { HandleImageDropzoneClickParams } from "./HandleImageDropzoneClick-types";

/**
 * Registers a delegated click handler that opens the shared swap popover whenever the
 * user clicks an empty image's dropzone.
 */
export const handleImageDropzoneClick = ({
	richTextEditorUI,
	editorAPI,
	internals,
}: HandleImageDropzoneClickParams) => {
	const unsubscribe = editorAPI.registerDOMEvent({
		when({ element }) {
			return element.matches(imagePart.dropzone.attr);
		},
		eventListener: {
			type: "click",
			listener(event) {
				const { currentTarget } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (currentTarget.$$editorRole !== htmlLayoutName) {
					throw new Error("CurrentTarget's type is invalid.");
				}

				const { $$parentElement: figure } = currentTarget;

				if (
					!figure ||
					figure.$$editorRole !== htmlLayoutName ||
					figure.$$localName !== "figure"
				) {
					throw new Error("Dropzone's parent must be the figure.");
				}

				showImageSwapPopover({ richTextEditorUI, internals, figure });
			},
		},
	});

	return () => {
		unsubscribe();
	};
};
