import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
} from "@rangex/core";
import { blockAlignAttr, componentsName } from "#engine-links";
import { createSeparatorStorage } from "#storage";
import type { CreateSeparatorResult } from "./CreateSeparator-types";

/*
 * Builds a separator block component wrapping a simple `hr` element.
 */
export const createSeparator = (): CreateSeparatorResult => {
	const blockComponentLine = createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.separator,
			content: { type: "custom" },
			customStorage: createSeparatorStorage(),
			editState: "false",
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			childNodes: [
				createHTMLLayout({
					localName: "hr",
					childNodes: [],
				}),
			],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});

	return blockComponentLine;
};
