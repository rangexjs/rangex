import {
	createBeamText,
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createContentLine,
	createHTMLLayout,
} from "rich-text-area";
import { blockAlignAttr, componentsName } from "../../../Constants";
import { assertNever } from "../../../ErrorHandling";
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
					localName: "img",
					domAttrs: {
						src,
						alt: "",
					},
				}),
			],
		}),
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});

	return blockNestedContextLine;
};

const readFileAsDataURL = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (typeof reader.result !== "string") {
				reject(new Error("FileReader result must be a string."));
				return;
			}

			resolve(reader.result);
		};

		reader.onerror = () => {
			reject(reader.error ?? new Error("Failed to read file."));
		};

		reader.readAsDataURL(file);
	});
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
}: InsertImageFromURLParams) => {
	const imageLine = createImageComponent({ src: url });

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
}: InsertImagesFromFilesParams) => {
	const dataURLs = await Promise.all(Array.from(files, readFileAsDataURL));

	const imageLines: CreateImageComponentResult[] = [];

	for (const dataURL of dataURLs) {
		imageLines.push(createImageComponent({ src: dataURL }));
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
			});
			return;
		}

		if (params.insertionType === "file-upload") {
			insertImagesFromFiles({
				editorAPI,
				blockComponentPlacement,
				files: params.files,
			});
			return;
		}

		assertNever(params);
	});

	return () => {
		unsubscribe();
	};
};
