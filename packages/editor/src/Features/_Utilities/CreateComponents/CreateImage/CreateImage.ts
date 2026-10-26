import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
} from "@rangex/core";
import { blockAlignAttr, componentsName, objectFitAttr } from "#constants";
import { type ImageAttrs, toDOMAttrs } from "#dom-attrs";
import { createImageStorage } from "#storage";
import type { CreateImageParams, CreateImageResult } from "./CreateImage-types";

/*
 * Builds an image block component wrapping a `figure`/`img` element with a default fit attribute.
 */
export const createImage = ({ src }: CreateImageParams): CreateImageResult => {
	const lineAttrs: ImageAttrs["line"] = {
		[blockAlignAttr.name]: blockAlignAttr.value.center,
	};

	const imgAttrs: ImageAttrs["img"] = {
		src,
		alt: "",
		[objectFitAttr.name]: objectFitAttr.value.cover,
	};

	return createBlockComponentLine({
		domAttrs: toDOMAttrs(lineAttrs),
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.image,
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
							domAttrs: toDOMAttrs(imgAttrs),
							childNodes: [],
						}),
					],
				}),
			],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
