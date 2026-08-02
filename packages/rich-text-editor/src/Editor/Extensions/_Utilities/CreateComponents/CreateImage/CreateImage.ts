import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createHTMLLayout,
} from "rich-text-area";
import { componentsName } from "#ports";
import {
	aspectRatioAttr,
	blockAlignAttr,
	objectFitAttr,
} from "../../../../Constants";
import type { CreateImageParams, CreateImageResult } from "./CreateImage-types";

export const createImage = ({ src }: CreateImageParams): CreateImageResult => {
	return createBlockNestedContextLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.image,
			content: { type: "custom" },
			editState: "false",
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
								alt: "",
								[objectFitAttr.name]: objectFitAttr.value.cover,
								[aspectRatioAttr.name]: aspectRatioAttr.value.auto,
							},
						}),
					],
				}),
			],
		}),
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});
};
