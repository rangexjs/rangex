import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
} from "rich-text-area";
import {
	aspectRatioAttr,
	blockAlignAttr,
	componentsName,
	objectFitAttr,
} from "../../../../Constants";
import { createVideoStorage } from "../../../../Storage";
import type { CreateVideoParams, CreateVideoResult } from "./CreateVideo-types";

export const createVideo = ({ src }: CreateVideoParams): CreateVideoResult => {
	return createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			componentName: componentsName.video,
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
								[aspectRatioAttr.name]: aspectRatioAttr.value.auto,
							},
						}),
					],
				}),
			],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
