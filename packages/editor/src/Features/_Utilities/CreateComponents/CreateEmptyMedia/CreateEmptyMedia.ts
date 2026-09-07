import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createDetachedContext,
} from "rich-text-area";
import {
	blockAlignAttr,
	componentsName,
	createEmptyMediaStorage,
} from "#engine-links";
import type { CreateEmptyMediaResult } from "./CreateEmptyMedia-types";

/**
 * Media is inserted empty — an unresolved placeholder, not a populated image/video/audio/
 * embed. Unlike image's dropzone, the placeholder's only child is a `DetachedContext`
 * `slot` — `ConfigureEmptyMedia`'s watcher reactively mounts the SolidJS picker UI into it
 * once the block connects, and forwards resolution onto `adapterBus` for a future
 * Image/Video/Audio/Embed extension to insert the real component.
 */
export const createEmptyMedia = (): CreateEmptyMediaResult => {
	const blockComponentLine = createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			componentName: componentsName.emptyMedia,
			content: { type: "custom" },
			customStorage: createEmptyMediaStorage(),
			editState: "false",
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			childNodes: [createDetachedContext({ localName: "slot" })],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});

	return blockComponentLine;
};
