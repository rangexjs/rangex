import {
	createContentLine,
	createFormattableTexts,
	createInlineComponent,
	createNestedEditable,
} from "rich-text-area";
import { componentsName } from "../../../../Constants";
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
