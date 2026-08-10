import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
} from "rich-text-area";
import { componentsName } from "#ports";
import { blockAlignAttr } from "../../../../Constants";
import { createSeparatorStorage } from "../../../../Storage";
import type { CreateSeparatorResult } from "./CreateSeparator-types";

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
