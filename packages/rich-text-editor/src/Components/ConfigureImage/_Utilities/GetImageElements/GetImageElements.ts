import { htmlLayoutName } from "rich-text-area";
import type {
	GetImageFigureParams,
	GetImageFigureResult,
	GetImageImgParams,
	GetImageImgResult,
} from "./GetImageElements-types";

export const getImageFigure = ({
	blockNestedContext,
}: GetImageFigureParams): GetImageFigureResult => {
	const [figure] = blockNestedContext.$$children;

	if (
		!figure ||
		figure.$$editorRole !== htmlLayoutName ||
		figure.$$localName !== "figure"
	) {
		throw new Error("BlockNestedContext's first child must be the figure.");
	}

	return figure;
};

export const getImageImg = ({
	figure,
}: GetImageImgParams): GetImageImgResult => {
	for (const child of figure.$$children) {
		if (child.$$editorRole === htmlLayoutName && child.$$localName === "img") {
			return child;
		}
	}

	throw new Error("Figure must contain an img.");
};
