import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createDetachedContext,
} from "@rangex/core";
import { componentsName } from "#constants";
import { createSourcePlaceholderStorage } from "#storage";
import type { CreateSourcePlaceholderResult } from "./CreateSourcePlaceholder-types";

/*
 * Builds an unresolved media placeholder block component, exposing a single `slot` child
 * that a picker UI can later mount into once a concrete media type is chosen.
 */
export const createSourcePlaceholder = (): CreateSourcePlaceholderResult => {
	const blockComponentLine = createBlockComponentLine({
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.sourcePlaceholder,
			content: { type: "custom" },
			customStorage: createSourcePlaceholderStorage(),
			editState: "false",
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			childNodes: [createDetachedContext({ localName: "slot" })],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});

	return blockComponentLine;
};
