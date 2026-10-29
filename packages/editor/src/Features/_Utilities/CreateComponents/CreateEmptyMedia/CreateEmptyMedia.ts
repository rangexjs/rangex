import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createDetachedContext,
} from "@rangex/core";
import { componentsName } from "#constants";
import { createEmptyMediaStorage } from "#storage";
import type { CreateEmptyMediaResult } from "./CreateEmptyMedia-types";

/*
 * Builds an unresolved media placeholder block component, exposing a single `slot` child
 * that a picker UI can later mount into once a concrete media type is chosen.
 */
export const createEmptyMedia = (): CreateEmptyMediaResult => {
	const blockComponentLine = createBlockComponentLine({
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.emptyMedia,
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
