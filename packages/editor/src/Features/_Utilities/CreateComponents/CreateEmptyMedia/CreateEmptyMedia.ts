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

/*
 * Builds an unresolved media placeholder block component, exposing a single `slot` child
 * that a picker UI can later mount into once a concrete media type is chosen.
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
