import type { ImageAttrs } from "@rangex/editor/image";

type ImgAttrs = ImageAttrs["img"];

type ImgAltAttrs = Pick<ImgAttrs, "alt" | "aria-hidden">;

/*
 * The alt of an image without alt text. A broken image only shows its fallback (see Image.css) if its alt isn't empty:
 * with alt="" it represents nothing, and isn't rendered at all. The image is hidden from screen readers instead
 * (aria-hidden), so the placeholder is never read.
 */
const placeholderAlt = "Image";

/**
 * Returns the image's alt text: empty if it's hidden from screen readers, as its alt is then the placeholder.
 */
export const getImageAltText = (imgAttrs: ImgAttrs | null) => {
	if (!imgAttrs || imgAttrs["aria-hidden"] === "true") {
		return "";
	}

	return imgAttrs.alt ?? "";
};

/**
 * Returns the img's alt attributes for the alt text: the placeholder, hidden from screen readers, if it's empty (or
 * whitespace only).
 */
export const createImageAltAttrs = (altText: string): ImgAltAttrs => {
	if (altText.trim() === "") {
		return { alt: placeholderAlt, "aria-hidden": "true" };
	}

	return { alt: altText, "aria-hidden": null };
};
