import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
} from "rich-text-area";
import { aspectRatioAttr, blockAlignAttr, componentsName } from "#engine-links";
import { createEmbedStorage } from "#storage";
import type { CreateEmbedParams, CreateEmbedResult } from "./CreateEmbed-types";

// Arbitrary third-party executable content, unlike img/video/audio — `sandbox`/`allow` are
// fixed rather than user-configurable so every embed gets a sane default policy.
// `allow-same-origin` alongside `allow-scripts` is safe here specifically because the
// iframe's origin is always the third-party provider's, never ours; the sandbox-escape
// concern that combination is usually flagged for only applies to same-origin content.
const embedSandbox =
	"allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation";
const embedAllow =
	"fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-write";

/*
 * Builds an embed block component wrapping a sandboxed `iframe` for third-party content,
 * with a fixed sandbox/allow policy and a default 16:9 aspect ratio.
 */
export const createEmbed = ({ src }: CreateEmbedParams): CreateEmbedResult => {
	return createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
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
							domAttrs: {
								src,
								title: "Embedded content",
								sandbox: embedSandbox,
								allow: embedAllow,
								loading: "lazy",
								[aspectRatioAttr.name]: aspectRatioAttr.value["16-9"],
							},
						}),
					],
				}),
			],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
