import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
} from "@rangex/core";
import { blockAlignAttr, componentsName } from "#constants";
import { createAudioStorage } from "#storage";
import type { CreateAudioParams, CreateAudioResult } from "./CreateAudio-types";

/*
 * Builds an audio block component wrapping an HTML `audio` element with playback controls.
 */
export const createAudio = ({ src }: CreateAudioParams): CreateAudioResult => {
	return createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
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
							domAttrs: {
								src,
								controls: "",
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
