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
import { getVideoElement } from "../GetVideoElements";
import type {
	GetVideoCaptionParams,
	GetVideoCaptionResult,
	SetVideoCaptionEnabledParams,
	SetVideoCaptionPositionParams,
	VideoCaptionPosition,
} from "./VideoCaption-types";

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
 * above or below the video — derived entirely from the figcaption's presence and
 * DOM order, not a separate stored flag.
 */
export const getVideoCaption = ({
	figure,
}: GetVideoCaptionParams): GetVideoCaptionResult => {
	const figcaption = getFigcaption(figure);

	if (!figcaption) {
		return { enabled: false, position: "below" };
	}

	const video = getVideoElement({ figure });

	const { $$children } = figure;

	const position: VideoCaptionPosition =
		$$children.indexOf(figcaption) < $$children.indexOf(video)
			? "above"
			: "below";

	return { enabled: true, position };
};

/**
 * Adds or removes the figcaption. Adding creates a fresh, empty `NestedEditable`
 * below the video; removing discards the figcaption and whatever the user had typed.
 */
export const setVideoCaptionEnabled = ({
	figure,
	enabled,
}: SetVideoCaptionEnabledParams) => {
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
 * Moves the figcaption before or after the video. No-op target state is
 * idempotent — always repositions relative to the video rather than checking
 * the current order first.
 */
export const setVideoCaptionPosition = ({
	figure,
	position,
}: SetVideoCaptionPositionParams) => {
	const figcaption = getFigcaption(figure);

	if (!figcaption) {
		throw new Error("Figure must contain a figcaption to reposition.");
	}

	const video = getVideoElement({ figure });

	figcaption.$$remove();

	({
		above: () => video.$$before(figcaption),
		below: () => video.$$after(figcaption),
	})[position]();
};
