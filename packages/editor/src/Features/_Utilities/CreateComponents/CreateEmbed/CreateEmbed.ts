import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
} from "@rangex/core";

import { componentsName } from "#constants";
import { toDOMAttrs } from "#dom-attrs";
import { createEmbedStorage } from "#storage";

import type { CreateEmbedParams, CreateEmbedResult } from "./CreateEmbed-types";

/*
 * Builds an embed block component wrapping a `figure`/`iframe` element for third-party content, with the given
 * attributes of its line, block and `iframe`. They aren't validated here.
 */
export const createEmbed = ({ attrs }: CreateEmbedParams): CreateEmbedResult => {
	return createBlockComponentLine({
		domAttrs: toDOMAttrs(attrs.line),
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.embed,
			content: { type: "custom" },
			customStorage: createEmbedStorage(),
			editState: "false",
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			domAttrs: toDOMAttrs(attrs.block),
			childNodes: [
				createHTMLLayout({
					localName: "figure",
					childNodes: [
						createHTMLLayout({
							localName: "iframe",
							domAttrs: toDOMAttrs(attrs.iframe),
							childNodes: [],
						}),
					],
				}),
			],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
