import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createHTMLLayout,
} from "rich-text-area";
import {
	blockAlignAttr,
	componentsName,
	imageAspectRatioAttr,
	imageObjectFitAttr,
} from "../../../Constants";
import type { HandleImageInsertionParams } from "./HandleImageInsertion-types";

const createImageLine = ({ src }: { src: string }) => {
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
								[imageObjectFitAttr.name]: imageObjectFitAttr.value.cover,
								[imageAspectRatioAttr.name]: imageAspectRatioAttr.value.auto,
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
 * support `$$replaceWith`. So a resolved `media` block becomes a brand new `image` line
 * entirely, not a mutation of the existing one.
 */
export const handleImageInsertion = ({
	editorAPI,
	onMediaResolve,
}: HandleImageInsertionParams) => {
	return onMediaResolve(({ blockNestedContext, type, src }) => {
		if (type !== "image") {
			return;
		}

		const { $$parentElement: blockNestedContextLine } = blockNestedContext;

		if (!blockNestedContextLine) {
			throw new Error("ParentElement not supposed to be null.");
		}

		blockNestedContextLine.$$replaceWith(createImageLine({ src }));

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});
};
