import { htmlLayoutRole } from "@rangex/core";

import type {
	GetImageFigureParams,
	GetImageFigureResult,
	GetImageImgParams,
	GetImageImgResult,
} from "./GetImageElements-types";

/*
 * Returns the block component's figure element, throwing if the first child isn't a figure.
 */
export const getImageFigure = ({ blockComponent }: GetImageFigureParams): GetImageFigureResult => {
	const [figure] = blockComponent.$$children;

	if (!figure || figure.$$editorRole !== htmlLayoutRole || figure.$$localName !== "figure") {
		throw new Error("BlockComponent's first child must be the figure.");
	}

	return figure;
};

/*
 * Returns the img element nested inside a figure, throwing if none is found.
 */
export const getImageImg = ({ figure }: GetImageImgParams): GetImageImgResult => {
	for (const child of figure.$$children) {
		if (child.$$editorRole === htmlLayoutRole && child.$$localName === "img") {
			return child;
		}
	}

	throw new Error("Figure must contain an img.");
};
