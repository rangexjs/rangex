import {
	createContentLine,
	createFormattableTexts,
	createHTMLLayout,
	createInlineComponent,
	createNestedEditable,
	type DOMAttrs,
} from "@rangex/core";
import { componentsName } from "#engine-links";
import { createLinkStorage } from "#storage";
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
		name: componentsName.link,
		content: { type: "bound-text" },
		customStorage: createLinkStorage(),
		childNodes: [
			createHTMLLayout({
				localName: "a",
				domAttrs,
				childNodes: [
					createNestedEditable({
						content: { type: "bound-text", unwrap: "if-empty" },
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
