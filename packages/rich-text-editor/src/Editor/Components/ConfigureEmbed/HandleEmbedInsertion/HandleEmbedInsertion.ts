import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createHTMLLayout,
} from "rich-text-area";
import {
	aspectRatioAttr,
	blockAlignAttr,
	componentsName,
} from "../../../Constants";
import type { HandleEmbedInsertionParams } from "./HandleEmbedInsertion-types";

// Arbitrary third-party executable content, unlike img/video/audio — `sandbox`/`allow` are
// fixed rather than user-configurable so every embed gets a sane default policy.
// `allow-same-origin` alongside `allow-scripts` is safe here specifically because the
// iframe's origin is always the third-party provider's, never ours; the sandbox-escape
// concern that combination is usually flagged for only applies to same-origin content.
const embedSandbox =
	"allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation";
const embedAllow =
	"fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-write";

const createEmbedLine = ({ src }: { src: string }) => {
	return createBlockNestedContextLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.embed,
			content: { type: "custom" },
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
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});
};

/**
 * `BlockNestedContext.$$componentName` is read-only and there's no way to swap a component
 * in place — the replacement has to happen at the `BlockNestedContextLine` level, which does
 * support `$$replaceWith`. So a resolved `media` block becomes a brand new `embed` line
 * entirely, not a mutation of the existing one.
 */
export const handleEmbedInsertion = ({
	editorAPI,
	onMediaResolve,
}: HandleEmbedInsertionParams) => {
	return onMediaResolve(({ blockNestedContext, type, src }) => {
		if (type !== "embed") {
			return;
		}

		const { $$parentElement: blockNestedContextLine } = blockNestedContext;

		if (!blockNestedContextLine) {
			throw new Error("ParentElement not supposed to be null.");
		}

		blockNestedContextLine.$$replaceWith(createEmbedLine({ src }));

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});
};
