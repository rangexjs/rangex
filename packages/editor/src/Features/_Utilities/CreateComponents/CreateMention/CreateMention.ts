import {
	createContentLine,
	createFormattableTexts,
	createInlineComponent,
	createNestedEditable,
} from "@rangex/core";
import { componentsName } from "#constants";
import { createMentionStorage } from "#storage";
import type {
	CreateMentionParams,
	CreateMentionResult,
} from "./CreateMention-types";

/*
 * Builds an inline mention component displaying "@displayName" as editable, formattable text and
 * storing the referenced user id.
 */
export const createMention = ({
	userId,
	displayName,
}: CreateMentionParams): CreateMentionResult => {
	const data = `@${displayName}`;

	return createInlineComponent({
		name: componentsName.mention,
		content: { type: "custom" },
		customStorage: createMentionStorage({ userId }),
		editState: "false",
		shouldSelectBeforeRemove: false,
		shouldSelectOnNavigation: false,
		childNodes: [
			createNestedEditable({
				display: "inline",
				editState: "inherit",
				allowedComponents: [],
				allowedContentLineLocalNames: null,
				allowedContentLineStyleAttrNames: null,
				allowedGlyphFormatterStyleAttrNames: null,
				allowedGlyphFormatterInlineTags: null,
				childNodes: [
					createContentLine({
						localName: "span",
						childNodes: [...createFormattableTexts({ data })],
					}),
				],
			}),
		],
	});
};
