import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
} from "rich-text-area";
import { blockAlignAttr, componentsName } from "../../../../Constants";
import { createAudioStorage } from "../../../../Storage";
import type { CreateAudioParams, CreateAudioResult } from "./CreateAudio-types";

export const createAudio = ({ src }: CreateAudioParams): CreateAudioResult => {
	return createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			componentName: componentsName.audio,
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
						}),
					],
				}),
			],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
