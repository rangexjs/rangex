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
	objectFitAttr,
} from "../../../Constants";
import type { HandleVideoInsertionParams } from "./HandleVideoInsertion-types";

const createVideoLine = ({ src }: { src: string }) => {
	return createBlockNestedContextLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.video,
			content: { type: "custom" },
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
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});
};

/**
 * `BlockNestedContext.$$componentName` is read-only and there's no way to swap a component
 * in place — the replacement has to happen at the `BlockNestedContextLine` level, which does
 * support `$$replaceWith`. So a resolved `media` block becomes a brand new `video` line
 * entirely, not a mutation of the existing one.
 */
export const handleVideoInsertion = ({
	editorAPI,
	onMediaResolve,
}: HandleVideoInsertionParams) => {
	return onMediaResolve(({ blockNestedContext, type, src }) => {
		if (type !== "video") {
			return;
		}

		const { $$parentElement: blockNestedContextLine } = blockNestedContext;

		if (!blockNestedContextLine) {
			throw new Error("ParentElement not supposed to be null.");
		}

		blockNestedContextLine.$$replaceWith(createVideoLine({ src }));

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});
};
