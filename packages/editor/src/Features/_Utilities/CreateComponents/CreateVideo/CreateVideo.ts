import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
} from "@rangex/core";
import { blockAlignAttr, componentsName, objectFitAttr } from "#constants";
import { toDOMAttrs, type VideoAttrs } from "#dom-attrs";
import { createVideoStorage } from "#storage";
import type { CreateVideoParams, CreateVideoResult } from "./CreateVideo-types";

/*
 * Builds a video block component wrapping a `figure`/`video` element with playback controls
 * and a default fit attribute.
 */
export const createVideo = ({ src }: CreateVideoParams): CreateVideoResult => {
	const lineAttrs: VideoAttrs["line"] = {
		[blockAlignAttr.name]: blockAlignAttr.value.center,
	};

	const videoAttrs: VideoAttrs["video"] = {
		src,
		controls: "",
		[objectFitAttr.name]: objectFitAttr.value.cover,
	};

	return createBlockComponentLine({
		domAttrs: toDOMAttrs(lineAttrs),
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.video,
			content: { type: "custom" },
			customStorage: createVideoStorage(),
			editState: "false",
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			childNodes: [
				createHTMLLayout({
					localName: "figure",
					childNodes: [
						createHTMLLayout({
							localName: "video",
							domAttrs: toDOMAttrs(videoAttrs),
							childNodes: [],
						}),
					],
				}),
			],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
