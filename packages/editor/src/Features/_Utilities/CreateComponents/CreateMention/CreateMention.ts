import {
	createContentLine,
	createFormattableTexts,
	createInlineComponent,
	createNestedEditable,
} from "rich-text-area";
import { componentsName, createMentionStorage } from "#engine-links";
import type {
	CreateMentionParams,
	CreateMentionResult,
} from "./CreateMention-types";

/*
 * Builds an inline mention component displaying "@name" as editable, formattable text and
 * storing the referenced user id.
 */
export const createMention = ({
	userId,
	name,
}: CreateMentionParams): CreateMentionResult => {
	const data = `@${name}`;

	return createInlineComponent({
		componentName: componentsName.mention,
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
