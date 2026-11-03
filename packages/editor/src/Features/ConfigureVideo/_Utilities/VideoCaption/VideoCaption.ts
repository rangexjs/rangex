import {
	createBeamText,
	createContentLine,
	createHTMLLayout,
	createNestedEditable,
	type HTMLLayout,
	htmlLayoutRole,
} from "@rangex/core";
import type { CaptionPosition } from "#adapters";
import { createTextAlignStructuredStyle } from "#structured-style";
import { getVideoElement } from "../GetVideoElements";
import type {
	GetVideoCaptionParams,
	GetVideoCaptionResult,
	SetVideoCaptionEnabledParams,
	SetVideoCaptionPositionParams,
} from "./VideoCaption-types";

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
 * the video — derived from the figcaption's presence and DOM order, not a stored flag.
 */
export const getVideoCaption = ({
	figure,
}: GetVideoCaptionParams): GetVideoCaptionResult => {
	const figcaption = getFigcaption(figure);

	if (!figcaption) {
		return { captionEnabled: false, captionPosition: "below" };
	}

	const video = getVideoElement({ figure });

	const { $$children } = figure;

	const position: CaptionPosition =
		$$children.indexOf(figcaption) < $$children.indexOf(video)
			? "above"
			: "below";

	return { captionEnabled: true, captionPosition: position };
};

/*
 * Adds or removes the figcaption. Adding creates a fresh, empty nested editable positioned above
 * or below the video per `position`; removing discards the figcaption and whatever the user had
 * typed in it.
 */
export const setVideoCaptionEnabled = ({
	figure,
	enabled,
	position,
}: SetVideoCaptionEnabledParams) => {
	const figcaption = getFigcaption(figure);

	if (!enabled) {
		figcaption?.$$remove();
		return;
	}

	if (figcaption) {
		return;
	}

	const textAlign = createTextAlignStructuredStyle({ textAlign: "center" });

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
 * Moves the figcaption before or after the video, always repositioning relative to the video
 * rather than checking the current order first. Throws if the figure has no figcaption.
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
