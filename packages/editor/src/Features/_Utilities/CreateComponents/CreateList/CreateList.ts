import {
	createBeamText,
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createContentLine,
	createList as createEngineList,
	createListItem,
	createNestedEditable,
} from "@rangex/core";
import { blockAlignAttr, componentsName } from "#constants";
import { createListStorage } from "#storage";
import type { CreateListParams, CreateListResult } from "./CreateList-types";

/*
 * Builds a list block component (ordered/unordered) with one item per given child line,
 * or a single empty item when none are provided.
 */
export const createList = ({
	localName,
	lineType,
	childNodes = [
		createContentLine({ localName: "p", childNodes: [createBeamText({})] }),
	],
}: CreateListParams): CreateListResult => {
	const display = (
		{
			"multi-line": "block multi-line",
			"single-line": "block single-line",
		} as const
	)[lineType];

	const list = createEngineList({
		localName,
		lineType,
		editState: "inherit",
		childNodes: childNodes.map((line) =>
			createListItem({
				childNodes: [
					createNestedEditable({
						display,
						editState: "inherit",
						allowedComponents: null,
						allowedContentLineLocalNames: null,
						allowedContentLineStyleAttrNames: null,
						allowedGlyphFormatterStyleAttrNames: null,
						allowedGlyphFormatterInlineTags: null,
						childNodes: [line],
					}),
				],
			}),
		),
	});

	return createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.list,
			content: { type: "list" },
			customStorage: createListStorage(),
			shouldSelectBeforeRemove: false,
			shouldSelectOnNavigation: false,
			editState: "inherit",
			childNodes: [list],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
