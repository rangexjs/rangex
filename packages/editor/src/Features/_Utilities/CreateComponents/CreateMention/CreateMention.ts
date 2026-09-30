import {
	createContentLine,
	createFormattableTexts,
	createInlineComponent,
	createNestedEditable,
} from "@rangex/core";
import { componentsName } from "#engine-links";
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
		childNodes: [
			createNestedEditable({
				content: { type: "default" },
				display: "inline",
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
