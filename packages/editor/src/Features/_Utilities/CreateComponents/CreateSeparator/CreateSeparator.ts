import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
} from "rich-text-area";
import {
	blockAlignAttr,
	componentsName,
	createSeparatorStorage,
} from "#engine-links";
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
			componentName: componentsName.separator,
			content: { type: "custom" },
			customStorage: createSeparatorStorage(),
			editState: "false",
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			childNodes: [createHTMLLayout({ localName: "hr" })],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});

	return blockComponentLine;
};
