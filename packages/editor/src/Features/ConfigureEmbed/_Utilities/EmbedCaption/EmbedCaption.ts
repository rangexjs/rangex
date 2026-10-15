import {
	createBeamText,
	createContentLine,
	createHTMLLayout,
	createNestedEditable,
	createStructuredStyleValue,
	type HTMLLayout,
	htmlLayoutRole,
} from "@rangex/core";
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
			child.$$editorRole === htmlLayoutRole &&
			child.$$localName === figcaptionLocalName
		) {
			return child;
		}
	}

	return null;
};

/*
 * Reads whether a figure's caption is currently shown and, if so, whether it sits above or below
 * the embed — derived from the figcaption's presence and DOM order, not a stored flag.
 */
export const getEmbedCaption = ({
	figure,
}: GetEmbedCaptionParams): GetEmbedCaptionResult => {
	const figcaption = getFigcaption(figure);

	if (!figcaption) {
		return { captionEnabled: false, captionPosition: "below" };
	}

	const embedElement = getEmbedElement({ figure });

	const { $$children } = figure;

	const position: CaptionPosition =
		$$children.indexOf(figcaption) < $$children.indexOf(embedElement)
			? "above"
			: "below";

	return { captionEnabled: true, captionPosition: position };
};

/*
 * Adds or removes the figcaption. Adding creates a fresh, empty nested editable positioned above
 * or below the embed per `position`; removing discards the figcaption and whatever the user had
 * typed in it.
 */
export const setEmbedCaptionEnabled = ({
	figure,
	enabled,
	position,
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
		display: "block single-line",
		editState: "true",
		allowedComponents: null,
		allowedContentLineLocalNames: null,
		allowedContentLineStyleAttrNames: null,
		allowedGlyphFormatterStyleAttrNames: null,
		allowedGlyphFormatterInlineTags: null,
		childNodes: [
			createContentLine({
				localName: "p",
				structuredStyle: { textAlign },
				childNodes: [createBeamText({})],
			}),
		],
	});

	const newFigcaption = createHTMLLayout({
		localName: figcaptionLocalName,
		childNodes: [nestedEditable],
	});

	({
		above: () => figure.$$prepend(newFigcaption),
		below: () => figure.$$append(newFigcaption),
	})[position]();
};

/*
 * Moves the figcaption before or after the embed element, always repositioning relative to it
 * rather than checking the current order first. Throws if the figure has no figcaption.
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
