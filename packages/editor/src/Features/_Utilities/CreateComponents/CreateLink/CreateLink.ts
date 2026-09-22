import {
	createContentLine,
	createFormattableTexts,
	createHTMLLayout,
	createInlineComponent,
	createNestedEditable,
	type DOMAttrs,
} from "rich-text-area";
import { componentsName, createLinkStorage } from "#engine-links";
import type { CreateLinkParams, CreateLinkResult } from "./CreateLink-types";

/*
 * Builds an inline link component wrapping an `a` element around editable, formattable text.
 */
export const createLink = ({
	text,
	href,
	target,
}: CreateLinkParams): CreateLinkResult => {
	const domAttrs: DOMAttrs = {
		...(href && { href }),
		...(target && { target }),
	};

	return createInlineComponent({
		componentName: componentsName.link,
		content: { type: "linked-characters" },
		customStorage: createLinkStorage(),
		childNodes: [
			createHTMLLayout({
				localName: "a",
				domAttrs,
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
