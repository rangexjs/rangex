import {
	createContentLine,
	createFormattableTexts,
	createInlineNestedContext,
	createNestedEditable,
} from "rich-text-area";
import { componentsName } from "#ports";
import { createMentionStorage } from "../../../../Storage";
import type {
	CreateMentionParams,
	CreateMentionResult,
} from "./CreateMention-types";

export const createMention = ({
	userId,
	name,
}: CreateMentionParams): CreateMentionResult => {
	const data = `@${name}`;

	return createInlineNestedContext({
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
