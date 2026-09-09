import {
	createBeamText,
	createContentLine,
	createHTMLLayout,
	createNestedEditable,
	createStructuredStyleValue,
	type HTMLLayout,
	htmlLayoutName,
} from "rich-text-area";
import type { CaptionPosition } from "#adapters";
import type { TextAlignStructuredStyleValue } from "#engine-links";
import { getEmbedElement } from "../GetEmbedElements";
import type {
	GetEmbedCaptionParams,
	GetEmbedCaptionResult,
	SetEmbedCaptionEnabledParams,
	SetEmbedCaptionPositionParams,
} from "./EmbedCaption-types";

const figcaptionLocalName = "figcaption";

const getFigcaption = (figure: HTMLLayout): HTMLLayout | null => {
	for (const child of figure.$$children) {
		if (
			child.$$editorRole === htmlLayoutName &&
			child.$$localName === figcaptionLocalName
		) {
			return child;
		}
	}

	return null;
};

/**
 * Reads whether a figure's caption is currently shown and, if so, whether it sits
 * above or below the embed — derived entirely from the figcaption's presence and
 * DOM order, not a separate stored flag.
 */
export const getEmbedCaption = ({
	figure,
}: GetEmbedCaptionParams): GetEmbedCaptionResult => {
	const figcaption = getFigcaption(figure);

	if (!figcaption) {
		return { enabled: false, position: "below" };
	}

	const embedElement = getEmbedElement({ figure });

	const { $$children } = figure;

	const position: CaptionPosition =
		$$children.indexOf(figcaption) < $$children.indexOf(embedElement)
			? "above"
			: "below";

	return { enabled: true, position };
};

/**
 * Adds or removes the figcaption. Adding creates a fresh, empty `NestedEditable`
 * below the embed; removing discards the figcaption and whatever the user had typed.
 */
export const setEmbedCaptionEnabled = ({
	figure,
	enabled,
}: SetEmbedCaptionEnabledParams) => {
	const figcaption = getFigcaption(figure);

	if (!enabled) {
		figcaption?.$$remove();
		return;
	}

	if (figcaption) {
		return;
	}

	const textAlign: TextAlignStructuredStyleValue = createStructuredStyleValue({
		type: "text-align",
		values: { textAlign: "center" },
		resolve: ({ textAlign }) => textAlign,
	});

	const nestedEditable = createNestedEditable({
		content: { type: "default" },
		display: "block single-line",
		editState: "true",
		childNodes: [
			createContentLine({
				localName: "p",
				structuredStyle: { textAlign },
				childNodes: [createBeamText({})],
			}),
		],
	});

	figure.$$append(
		createHTMLLayout({
			localName: figcaptionLocalName,
			childNodes: [nestedEditable],
		}),
	);
};

/**
 * Moves the figcaption before or after the embed. No-op target state is
 * idempotent — always repositions relative to the embed rather than checking
 * the current order first.
 */
export const setEmbedCaptionPosition = ({
	figure,
	position,
}: SetEmbedCaptionPositionParams) => {
	const figcaption = getFigcaption(figure);

	if (!figcaption) {
		throw new Error("Figure must contain a figcaption to reposition.");
	}

	const embedElement = getEmbedElement({ figure });

	figcaption.$$remove();

	({
		above: () => embedElement.$$before(figcaption),
		below: () => embedElement.$$after(figcaption),
	})[position]();
};
