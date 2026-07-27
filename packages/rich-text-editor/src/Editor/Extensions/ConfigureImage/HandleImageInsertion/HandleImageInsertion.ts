import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createHTMLLayout,
} from "rich-text-area";
import {
	aspectRatioAttr,
	blockAlignAttr,
	componentsName,
	objectFitAttr,
} from "../../../Constants";
import type { HandleImageInsertionParams } from "./HandleImageInsertion-types";

const createImageLine = ({ src }: { src: string }) => {
	return createBlockNestedContextLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.image,
			content: { type: "custom" },
			editState: "false",
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			childNodes: [
				createHTMLLayout({
					localName: "figure",
					childNodes: [
						createHTMLLayout({
							localName: "img",
							domAttrs: {
								src,
								alt: "",
								[objectFitAttr.name]: objectFitAttr.value.cover,
								[aspectRatioAttr.name]: aspectRatioAttr.value.auto,
							},
						}),
					],
				}),
			],
		}),
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});
};

/**
 * Inserts a real image block at the caret whenever `onMediaResolve` reports a resolved image
 * source, filtering out every other media type's resolution.
 */
export const handleImageInsertion = ({
	editorPort,
	editorAPI,
}: HandleImageInsertionParams) => {
	return editorPort.onMediaResolve(({ type, src }) => {
		if (type !== "image") {
			return;
		}

		const selection = editorAPI.getEditorSelection();
		const { fromText, fromOffset } = selection.getBoundaryPoints();

		editorAPI.insertNode({
			fromNode: fromText,
			fromOffset,
			lines: [createImageLine({ src })],
			breakBeforeInsert: false,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});
};
