import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
} from "@rangex/core";
import { blockAlignAttr, componentsName } from "#constants";
import {
	type EmbedAttrs,
	embedAllow,
	embedLoading,
	embedSandbox,
	toDOMAttrs,
} from "#dom-attrs";
import { createEmbedStorage } from "#storage";
import type { CreateEmbedParams, CreateEmbedResult } from "./CreateEmbed-types";

/*
 * Builds an embed block component wrapping a sandboxed `iframe` for third-party content,
 * with a fixed sandbox/allow policy (see embedSandbox). Without an aspect ratio, its ratio is left to the styles.
 */
export const createEmbed = ({ src }: CreateEmbedParams): CreateEmbedResult => {
	const lineAttrs: EmbedAttrs["line"] = {
		[blockAlignAttr.name]: blockAlignAttr.value.center,
	};

	const iframeAttrs: EmbedAttrs["iframe"] = {
		src,
		title: "Embedded content",
		sandbox: embedSandbox,
		allow: embedAllow,
		loading: embedLoading,
	};

	return createBlockComponentLine({
		domAttrs: toDOMAttrs(lineAttrs),
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.embed,
			content: { type: "custom" },
			customStorage: createEmbedStorage(),
			editState: "false",
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			childNodes: [
				createHTMLLayout({
					localName: "figure",
					childNodes: [
						createHTMLLayout({
							localName: "iframe",
							domAttrs: toDOMAttrs(iframeAttrs),
							childNodes: [],
						}),
					],
				}),
			],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
