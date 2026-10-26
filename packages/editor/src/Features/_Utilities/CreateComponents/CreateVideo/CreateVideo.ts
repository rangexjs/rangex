import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
} from "@rangex/core";
import { blockAlignAttr, componentsName, objectFitAttr } from "#engine-links";
import { createVideoStorage } from "#storage";
import type { CreateVideoParams, CreateVideoResult } from "./CreateVideo-types";

/*
 * Builds a video block component wrapping a `figure`/`video` element with playback controls
 * and a default fit attribute.
 */
export const createVideo = ({ src }: CreateVideoParams): CreateVideoResult => {
	return createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
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
							domAttrs: {
								src,
								controls: "",
								[objectFitAttr.name]: objectFitAttr.value.cover,
							},
							childNodes: [],
						}),
					],
				}),
			],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
