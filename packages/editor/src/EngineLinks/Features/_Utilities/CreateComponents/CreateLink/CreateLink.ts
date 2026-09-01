import {
	createContentLine,
	createFormattableTexts,
	createHTMLLayout,
	createInlineComponent,
	createNestedEditable,
} from "rich-text-area";
import { componentsName } from "../../../../Constants";
import { createLinkStorage } from "../../../../Storage";
import type { CreateLinkParams, CreateLinkResult } from "./CreateLink-types";

export const createLink = ({
	text,
	href,
	target,
}: CreateLinkParams): CreateLinkResult => {
	return createInlineComponent({
		componentName: componentsName.link,
		content: { type: "linked-characters" },
		customStorage: createLinkStorage(),
		childNodes: [
			createHTMLLayout({
				localName: "a",
				domAttrs: { href, target },
				childNodes: [
					createNestedEditable({
						content: { type: "linked-characters", unwrap: "if-empty" },
						allowedComponents: [],
						display: "inline",
						childNodes: [
							createContentLine({
								localName: "span",
								childNodes: [...createFormattableTexts({ data: text })],
							}),
						],
					}),
				],
			}),
		],
	});
};
