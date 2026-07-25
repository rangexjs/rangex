import {
	createBeamText,
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createContentLine,
	createDetachedContext,
} from "rich-text-area";
import { blockAlignAttr, componentsName } from "../../../Constants";
import type {
	CreateEmptyMediaComponentResult,
	HandleEmptyMediaInsertionParams,
} from "./HandleEmptyMediaInsertion-types";

/**
 * Media is inserted empty — an unresolved placeholder, not a populated image/video/audio/
 * embed. Unlike image's dropzone, the placeholder's only child is a `DetachedContext`
 * `slot` — `ConfigureEmptyMedia`'s watcher reactively mounts the SolidJS picker UI into it
 * once the block connects, and forwards resolution onto `adapterBus` for a future
 * Image/Video/Audio/Embed extension to insert the real component.
 */
const createEmptyMediaComponent = (): CreateEmptyMediaComponentResult => {
	const blockNestedContextLine = createBlockNestedContextLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.emptyMedia,
			content: { type: "custom" },
			editState: "false",
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			childNodes: [createDetachedContext({ localName: "slot" })],
		}),
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});

	return blockNestedContextLine;
};

export const handleEmptyMediaInsertion = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleEmptyMediaInsertionParams) => {
	const unsubscribe = editorPort.onInsertRequest(() => {
		const emptyMediaLine = createEmptyMediaComponent();

		const trailingLine = createContentLine({
			localName: "p",
			childNodes: [createBeamText()],
		});

		blockComponentPlacement.insertBySelection({
			lines: [emptyMediaLine, trailingLine],
			shouldReplaceContentLineIfEmpty: true,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		const selection = editorAPI.getEditorSelection();

		selection.setBoundaryPoints({
			fromNode: trailingLine,
			fromOffset: 0,
			toNode: trailingLine,
			toOffset: 0,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
