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
import { getImageImg } from "../GetImageElements";
import type {
	GetImageCaptionParams,
	GetImageCaptionResult,
	SetImageCaptionEnabledParams,
	SetImageCaptionPositionParams,
} from "./ImageCaption-types";

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

/*
 * Reads whether a figure's caption is currently shown and, if so, whether it sits above or below
 * the image — derived from the figcaption's presence and DOM order, not a stored flag.
 */
export const getImageCaption = ({
	figure,
}: GetImageCaptionParams): GetImageCaptionResult => {
	const figcaption = getFigcaption(figure);

	if (!figcaption) {
		return { captionEnabled: false, captionPosition: "below" };
	}

	const img = getImageImg({ figure });

	const { $$children } = figure;

	const position: CaptionPosition =
		$$children.indexOf(figcaption) < $$children.indexOf(img)
			? "above"
			: "below";

	return { captionEnabled: true, captionPosition: position };
};

/*
 * Adds or removes the figcaption. Adding creates a fresh, empty nested editable positioned above
 * or below the image per `position`; removing discards the figcaption and whatever the user had
 * typed in it.
 */
export const setImageCaptionEnabled = ({
	figure,
	enabled,
	position,
}: SetImageCaptionEnabledParams) => {
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
 * Moves the figcaption before or after the img, always repositioning relative to the img rather
 * than checking the current order first. Throws if the figure has no figcaption.
 */
export const setImageCaptionPosition = ({
	figure,
	position,
}: SetImageCaptionPositionParams) => {
	const figcaption = getFigcaption(figure);

	if (!figcaption) {
		throw new Error("Figure must contain a figcaption to reposition.");
	}

	const img = getImageImg({ figure });

	figcaption.$$remove();

	({
		above: () => img.$$before(figcaption),
		below: () => img.$$after(figcaption),
	})[position]();
};
