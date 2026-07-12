import {
	createBeamText,
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createContentLine,
	createHTMLLayout,
} from "rich-text-area";
import { blockAlignAttr, componentsName } from "../../../Constants";
import { createImageDropzone } from "../_Utilities";
import type {
	CreateImageComponentResult,
	HandleImageInsertionParams,
} from "./HandleImageInsertion-types";

/**
 * Images are inserted empty — an unfilled dropzone placeholder, not a populated `img`.
 * The real `img` is created later, once a source is provided through the dropzone's
 * popover or a file drop.
 */
const createImageComponent = (): CreateImageComponentResult => {
	const blockNestedContextLine = createBlockNestedContextLine({
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
					childNodes: [createImageDropzone()],
				}),
			],
		}),
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});

	return blockNestedContextLine;
};

export const handleImageInsertion = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: HandleImageInsertionParams) => {
	const unsubscribe = richTextEditorUI.onNodeInsertion((params) => {
		if (params.type !== "image") {
			return;
		}

		const imageLine = createImageComponent();

		const trailingLine = createContentLine({
			localName: "p",
			childNodes: [createBeamText()],
		});

		blockComponentPlacement.insertBySelection({
			lines: [imageLine, trailingLine],
			shouldReplaceContentLineIfEmpty: true,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		const selection = editorAPI.getEditorSelection();

		selection.setBoundaryPoints({
			fromNode: trailingLine,
			fromOffset: 0,
			toNode: trailingLine,
			toOffset: 0,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
