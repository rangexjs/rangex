import type {
	CreateUploadSVGParams,
	CreateUploadSVGResult,
} from "./CreateUploadSVG-types";

/**
 * Parses raw `<svg>` markup into a DOM `Element`, for embedding an upload/media icon
 * inside a `DetachedContext`'s shadow tree — shared across components (image, video,
 * future media types) so each one only needs to supply its own icon markup.
 */
export const createUploadSVG = ({
	svgMarkup,
}: CreateUploadSVGParams): CreateUploadSVGResult => {
	const { documentElement } = new DOMParser().parseFromString(
		svgMarkup,
		"image/svg+xml",
	);

	return documentElement;
};
