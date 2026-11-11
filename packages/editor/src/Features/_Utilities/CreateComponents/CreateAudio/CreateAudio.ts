import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
} from "@rangex/core";

import { componentsName } from "#constants";
import { toDOMAttrs } from "#dom-attrs";
import { createAudioStorage } from "#storage";

import type { CreateAudioParams, CreateAudioResult } from "./CreateAudio-types";

/*
 * Builds an audio block component wrapping a `figure`/`audio` element, with the given attributes of its line, block
 * and `audio`. They aren't validated here.
 */
export const createAudio = ({ attrs }: CreateAudioParams): CreateAudioResult => {
	return createBlockComponentLine({
		domAttrs: toDOMAttrs(attrs.line),
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.audio,
			content: { type: "custom" },
			customStorage: createAudioStorage(),
			editState: "false",
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			domAttrs: toDOMAttrs(attrs.block),
			childNodes: [
				createHTMLLayout({
					localName: "figure",
					childNodes: [
						createHTMLLayout({
							localName: "audio",
							domAttrs: toDOMAttrs(attrs.audio),
							childNodes: [],
						}),
					],
				}),
			],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
