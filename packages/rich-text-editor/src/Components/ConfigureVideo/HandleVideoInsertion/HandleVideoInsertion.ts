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
	CreateVideoComponentParams,
	CreateVideoComponentResult,
	HandleVideoInsertionParams,
	InsertVideoFromURLParams,
	InsertVideosFromFilesParams,
	InsertVideosParams,
} from "./HandleVideoInsertion-types";

const createVideoComponent = ({
	src,
	title,
}: CreateVideoComponentParams): CreateVideoComponentResult => {
	const blockNestedContextLine = createBlockNestedContextLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.video,
			content: { type: "custom" },
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
								"aria-label": title,
								controls: "",
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
 * Videos have no editable content of their own, so a trailing empty paragraph
 * is inserted right after them.
 */
const insertVideos = ({
	editorAPI,
	blockComponentPlacement,
	videoLines,
}: InsertVideosParams) => {
	if (!videoLines.length) {
		return;
	}

	const trailingLine = createContentLine({
		localName: "p",
		childNodes: [createBeamText()],
	});

	blockComponentPlacement.insertBySelection({
		lines: [...videoLines, trailingLine],
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

const insertVideoFromURL = ({
	editorAPI,
	blockComponentPlacement,
	url,
	title,
}: InsertVideoFromURLParams) => {
	const videoLine = createVideoComponent({ src: url, title });

	insertVideos({
		editorAPI,
		blockComponentPlacement,
		videoLines: [videoLine],
	});
};

const insertVideosFromFiles = async ({
	editorAPI,
	blockComponentPlacement,
	files,
	title,
}: InsertVideosFromFilesParams) => {
	const dataURLs = await Promise.all(Array.from(files, readFileAsDataURL));

	const videoLines: CreateVideoComponentResult[] = [];

	for (const dataURL of dataURLs) {
		videoLines.push(createVideoComponent({ src: dataURL, title }));
	}

	insertVideos({ editorAPI, blockComponentPlacement, videoLines });
};

export const handleVideoInsertion = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: HandleVideoInsertionParams) => {
	const unsubscribe = richTextEditorUI.onNodeInsertion((params) => {
		if (params.type !== "video") {
			return;
		}

		if (params.insertionType === "url") {
			insertVideoFromURL({
				editorAPI,
				blockComponentPlacement,
				url: params.url,
				title: params.title,
			});
			return;
		}

		if (params.insertionType === "file-upload") {
			insertVideosFromFiles({
				editorAPI,
				blockComponentPlacement,
				files: params.files,
				title: params.title,
			});
			return;
		}

		assertNever(params);
	});

	return () => {
		unsubscribe();
	};
};
