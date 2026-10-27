import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
} from "@rangex/core";
import { blockAlignAttr, componentsName } from "#constants";
import { type AudioAttrs, toDOMAttrs } from "#dom-attrs";
import { createAudioStorage } from "#storage";
import type { CreateAudioParams, CreateAudioResult } from "./CreateAudio-types";

/*
 * Builds an audio block component wrapping an HTML `audio` element with playback controls.
 */
export const createAudio = ({ src }: CreateAudioParams): CreateAudioResult => {
	const lineAttrs: AudioAttrs["line"] = {
		[blockAlignAttr.name]: blockAlignAttr.value.center,
	};

	const audioAttrs: AudioAttrs["audio"] = {
		src,
		controls: "",
	};

	return createBlockComponentLine({
		domAttrs: toDOMAttrs(lineAttrs),
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.audio,
			content: { type: "custom" },
			customStorage: createAudioStorage(),
			editState: "false",
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			childNodes: [
				createHTMLLayout({
					localName: "figure",
					childNodes: [
						createHTMLLayout({
							localName: "audio",
							domAttrs: toDOMAttrs(audioAttrs),
							childNodes: [],
						}),
					],
				}),
			],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
