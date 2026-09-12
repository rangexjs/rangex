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
import { getAudioElement } from "../GetAudioElements";
import type {
	GetAudioCaptionParams,
	GetAudioCaptionResult,
	SetAudioCaptionEnabledParams,
	SetAudioCaptionPositionParams,
} from "./AudioCaption-types";

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
 * the audio — derived from the figcaption's presence and DOM order, not a stored flag.
 */
export const getAudioCaption = ({
	figure,
}: GetAudioCaptionParams): GetAudioCaptionResult => {
	const figcaption = getFigcaption(figure);

	if (!figcaption) {
		return { enabled: false, position: "below" };
	}

	const audio = getAudioElement({ figure });

	const { $$children } = figure;

	const position: CaptionPosition =
		$$children.indexOf(figcaption) < $$children.indexOf(audio)
			? "above"
			: "below";

	return { enabled: true, position };
};

/*
 * Adds or removes the figcaption. Adding creates a fresh, empty nested editable below the audio;
 * removing discards the figcaption and whatever the user had typed in it.
 */
export const setAudioCaptionEnabled = ({
	figure,
	enabled,
}: SetAudioCaptionEnabledParams) => {
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

/*
 * Moves the figcaption before or after the audio, always repositioning relative to the audio
 * rather than checking the current order first. Throws if the figure has no figcaption.
 */
export const setAudioCaptionPosition = ({
	figure,
	position,
}: SetAudioCaptionPositionParams) => {
	const figcaption = getFigcaption(figure);

	if (!figcaption) {
		throw new Error("Figure must contain a figcaption to reposition.");
	}

	const audio = getAudioElement({ figure });

	figcaption.$$remove();

	({
		above: () => audio.$$before(figcaption),
		below: () => audio.$$after(figcaption),
	})[position]();
};
