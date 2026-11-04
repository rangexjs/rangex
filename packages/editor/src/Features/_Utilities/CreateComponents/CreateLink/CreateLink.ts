import {
	createContentLine,
	createFormattableTexts,
	createHTMLLayout,
	createInlineComponent,
	createNestedEditable,
} from "@rangex/core";
import { componentsName, linkDefinition } from "#constants";
import { toDOMAttrs } from "#dom-attrs";
import { createLinkStorage } from "#storage";
import type { CreateLinkParams, CreateLinkResult } from "./CreateLink-types";

/*
 * Builds an inline link component wrapping an `a` element around editable, formattable text. Neither the text nor the
 * attrs are validated here.
 */
export const createLink = ({
	text,
	attrs,
}: CreateLinkParams): CreateLinkResult => {
	return createInlineComponent({
		name: componentsName.link,
		content: { type: "bound-text", unwrap: "if-empty" },
		customStorage: createLinkStorage(),
		shouldSelectBeforeRemove: false,
		shouldSelectOnNavigation: false,
		editState: "inherit",
		childNodes: [
			createHTMLLayout({
				localName: "a",
				domAttrs: toDOMAttrs(attrs.anchor),
				childNodes: [
					createNestedEditable({
						...linkDefinition.nestedEditableProps,
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
