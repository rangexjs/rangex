import { blockComponentLineRole, htmlLayoutRole } from "@rangex/core";
import type {
	GetImagePartsParams,
	GetImagePartsResult,
} from "./GetImageParts-types";

/*
 * Returns the image's parts: its line, the BlockComponentLine it's in, its block, the BlockComponent itself, and its img,
 * the `img` HTMLLayout inside the `figure` HTMLLayout that must be its first child.
 */
export const getImageParts = ({
	image,
}: GetImagePartsParams): GetImagePartsResult => {
	const line = image.$$parentElement;

	if (line?.$$editorRole !== blockComponentLineRole) {
		throw new Error("Image must be in a BlockComponentLine.");
	}

	const [figure] = image.$$children;

	if (
		!figure ||
		figure.$$editorRole !== htmlLayoutRole ||
		figure.$$localName !== "figure"
	) {
		throw new Error("Image's first child must be the figure.");
	}

	for (const child of figure.$$children) {
		if (child.$$editorRole === htmlLayoutRole && child.$$localName === "img") {
			return { line, block: image, img: child };
		}
	}

	throw new Error("Image's figure must contain an img.");
};
