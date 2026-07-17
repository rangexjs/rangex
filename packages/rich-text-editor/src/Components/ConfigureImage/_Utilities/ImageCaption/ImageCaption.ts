import {
	createBeamText,
	createContentLine,
	createHTMLLayout,
	createNestedEditable,
	createStructuredStyleValue,
	type HTMLLayout,
	htmlLayoutName,
} from "rich-text-area";
import type { TextAlignStructuredStyleValue } from "../../../../SelectionStyle";
import { getImageImg } from "../GetImageElements";
import type {
	GetImageCaptionParams,
	GetImageCaptionResult,
	ImageCaptionPosition,
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

/**
 * Reads whether a figure's caption is currently shown and, if so, whether it sits
 * above or below the image — derived entirely from the figcaption's presence and
 * DOM order, not a separate stored flag.
 */
export const getImageCaption = ({
	figure,
}: GetImageCaptionParams): GetImageCaptionResult => {
	const figcaption = getFigcaption(figure);

	if (!figcaption) {
		return { enabled: false, position: "below" };
	}

	const img = getImageImg({ figure });

	const { $$children } = figure;

	const position: ImageCaptionPosition =
		$$children.indexOf(figcaption) < $$children.indexOf(img)
			? "above"
			: "below";

	return { enabled: true, position };
};

/**
 * Adds or removes the figcaption. Adding creates a fresh, empty `NestedEditable`
 * below the image; removing discards the figcaption and whatever the user had typed.
 */
export const setImageCaptionEnabled = ({
	figure,
	enabled,
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
				childNodes: [createBeamText()],
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
 * Moves the figcaption before or after the img. No-op target state is
 * idempotent — always repositions relative to the img rather than checking
 * the current order first.
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
