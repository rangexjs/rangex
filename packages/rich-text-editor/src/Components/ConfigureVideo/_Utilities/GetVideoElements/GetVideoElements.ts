import { htmlLayoutName } from "rich-text-area";
import type {
	GetVideoElementParams,
	GetVideoElementResult,
	GetVideoFigureParams,
	GetVideoFigureResult,
} from "./GetVideoElements-types";

export const getVideoFigure = ({
	blockNestedContext,
}: GetVideoFigureParams): GetVideoFigureResult => {
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

export const getVideoElement = ({
	figure,
}: GetVideoElementParams): GetVideoElementResult => {
	for (const child of figure.$$children) {
		if (
			child.$$editorRole === htmlLayoutName &&
			child.$$localName === "video"
		) {
			return child;
		}
	}

	throw new Error("Figure must contain a video.");
};
