import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createHTMLLayout,
} from "rich-text-area";
import { blockAlignAttr, componentsName } from "../../../Constants";
import type { HandleAudioInsertionParams } from "./HandleAudioInsertion-types";

const createAudioLine = ({ src }: { src: string }) => {
	return createBlockNestedContextLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.audio,
			content: { type: "custom" },
			editState: "false",
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			childNodes: [
				createHTMLLayout({
					localName: "figure",
					childNodes: [
						createHTMLLayout({
							localName: "audio",
							domAttrs: {
								src,
								controls: "",
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
 * support `$$replaceWith`. So a resolved `media` block becomes a brand new `audio` line
 * entirely, not a mutation of the existing one.
 */
export const handleAudioInsertion = ({
	editorAPI,
	onMediaResolve,
}: HandleAudioInsertionParams) => {
	return onMediaResolve(({ blockNestedContext, type, src }) => {
		if (type !== "audio") {
			return;
		}

		const { $$parentElement: blockNestedContextLine } = blockNestedContext;

		if (!blockNestedContextLine) {
			throw new Error("ParentElement not supposed to be null.");
		}

		blockNestedContextLine.$$replaceWith(createAudioLine({ src }));

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});
};
