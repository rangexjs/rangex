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
	createImageStorage,
	objectFitAttr,
} from "#engine-links";
import type { CreateImageParams, CreateImageResult } from "./CreateImage-types";

/*
 * Builds an image block component wrapping a `figure`/`img` element with default fit and
 * aspect-ratio attributes.
 */
export const createImage = ({ src }: CreateImageParams): CreateImageResult => {
	return createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			componentName: componentsName.image,
			content: { type: "custom" },
			customStorage: createImageStorage(),
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
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
