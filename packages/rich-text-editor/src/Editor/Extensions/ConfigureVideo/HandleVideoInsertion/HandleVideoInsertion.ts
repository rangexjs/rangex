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
import type { HandleVideoInsertionParams } from "./HandleVideoInsertion-types";

const createVideoLine = ({ src }: { src: string }) => {
	return createBlockNestedContextLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.video,
			content: { type: "custom" },
			editState: "false",
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			childNodes: [
				createHTMLLayout({
					localName: "figure",
					childNodes: [
						createHTMLLayout({
							localName: "video",
							domAttrs: {
								src,
								controls: "",
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
 * Inserts a real video block at the caret whenever `onMediaResolve` reports a resolved video
 * source, filtering out every other media type's resolution.
 */
export const handleVideoInsertion = ({
	editorPort,
	editorAPI,
}: HandleVideoInsertionParams) => {
	return editorPort.onMediaResolve(({ type, src }) => {
		if (type !== "video") {
			return;
		}

		const selection = editorAPI.getEditorSelection();
		const { fromText, fromOffset } = selection.getBoundaryPoints();

		editorAPI.insertNode({
			fromNode: fromText,
			fromOffset,
			lines: [createVideoLine({ src })],
			breakBeforeInsert: false,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});
};
