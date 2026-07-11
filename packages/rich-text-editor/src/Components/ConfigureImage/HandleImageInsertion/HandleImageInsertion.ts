import {
	createBeamText,
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createContentLine,
	createHTMLLayout,
} from "rich-text-area";
import {
	blockAlignAttr,
	componentsName,
	imageAspectRatioAttr,
	imageObjectFitAttr,
} from "../../../Constants";
import { assertNever } from "../../../ErrorHandling";
import { readFileAsDataURL } from "../_Utilities";
import type {
	CreateImageComponentParams,
	CreateImageComponentResult,
	HandleImageInsertionParams,
	InsertImageFromURLParams,
	InsertImagesFromFilesParams,
	InsertImagesParams,
} from "./HandleImageInsertion-types";

const createImageComponent = ({
	src,
	alt,
}: CreateImageComponentParams): CreateImageComponentResult => {
	const blockNestedContextLine = createBlockNestedContextLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.image,
			content: { type: "custom" },
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
								alt,
								[imageObjectFitAttr.name]: imageObjectFitAttr.value.cover,
								[imageAspectRatioAttr.name]: imageAspectRatioAttr.value.auto,
							},
						}),
					],
				}),
			],
		}),
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});

	return blockNestedContextLine;
};

/**
 * Images have no editable content of their own, so a trailing empty paragraph
 * is inserted right after them.
 */
const insertImages = ({
	editorAPI,
	blockComponentPlacement,
	imageLines,
}: InsertImagesParams) => {
	if (!imageLines.length) {
		return;
	}

	const trailingLine = createContentLine({
		localName: "p",
		childNodes: [createBeamText()],
	});

	blockComponentPlacement.insertBySelection({
		lines: [...imageLines, trailingLine],
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
};

const insertImageFromURL = ({
	editorAPI,
	blockComponentPlacement,
	url,
	alt,
}: InsertImageFromURLParams) => {
	const imageLine = createImageComponent({ src: url, alt });

	insertImages({
		editorAPI,
		blockComponentPlacement,
		imageLines: [imageLine],
	});
};

const insertImagesFromFiles = async ({
	editorAPI,
	blockComponentPlacement,
	files,
	alt,
}: InsertImagesFromFilesParams) => {
	const dataURLs = await Promise.all(Array.from(files, readFileAsDataURL));

	const imageLines: CreateImageComponentResult[] = [];

	for (const dataURL of dataURLs) {
		imageLines.push(createImageComponent({ src: dataURL, alt }));
	}

	insertImages({ editorAPI, blockComponentPlacement, imageLines });
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

		if (params.insertionType === "url") {
			insertImageFromURL({
				editorAPI,
				blockComponentPlacement,
				url: params.url,
				alt: params.alt,
			});
			return;
		}

		if (params.insertionType === "file-upload") {
			insertImagesFromFiles({
				editorAPI,
				blockComponentPlacement,
				files: params.files,
				alt: params.alt,
			});
			return;
		}

		assertNever(params);
	});

	return () => {
		unsubscribe();
	};
};
