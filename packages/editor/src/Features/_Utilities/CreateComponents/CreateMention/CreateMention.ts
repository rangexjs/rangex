import {
	createContentLine,
	createFormattableTexts,
	createInlineComponent,
	createNestedEditable,
} from "@rangex/core";
import { componentsName, mentionDefinition } from "#constants";
import { createMentionStorage } from "#storage";
import type {
	CreateMentionParams,
	CreateMentionResult,
} from "./CreateMention-types";

/*
 * Builds an inline mention component displaying its displayText as formattable text and storing the referenced
 * user id.
 */
export const createMention = ({
	userId,
	displayText,
}: CreateMentionParams): CreateMentionResult => {
	return createInlineComponent({
		name: componentsName.mention,
		content: { type: "custom" },
		customStorage: createMentionStorage({ userId }),
		editState: "false",
		shouldSelectBeforeRemove: false,
		shouldSelectOnNavigation: false,
		childNodes: [
			createNestedEditable({
				...mentionDefinition.nestedEditableProps,
				childNodes: [
					createContentLine({
						localName: "span",
						childNodes: [...createFormattableTexts({ data: displayText })],
					}),
				],
			}),
		],
	});
};
