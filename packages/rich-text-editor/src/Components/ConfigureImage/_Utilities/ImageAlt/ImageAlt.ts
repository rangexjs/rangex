import type {
	GetImageAltParams,
	GetImageAltResult,
	SetImageAltParams,
} from "./ImageAlt-types";

export const getImageAlt = ({ img }: GetImageAltParams): GetImageAltResult =>
	img.getAttribute("alt") ?? "";

export const setImageAlt = ({ img, alt }: SetImageAltParams) => {
	img.setAttribute("alt", alt);
};
