import type {
	CreateUploadSVGParams,
	CreateUploadSVGResult,
} from "./CreateUploadSVG-types";

/*
 * Parses raw SVG markup into a DOM `Element`.
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
