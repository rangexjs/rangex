import { htmlLayoutName } from "rich-text-area";
import type {
	GetVideoElementParams,
	GetVideoElementResult,
	GetVideoFigureParams,
	GetVideoFigureResult,
} from "./GetVideoElements-types";

export const getVideoFigure = ({
	blockComponent,
}: GetVideoFigureParams): GetVideoFigureResult => {
	const [figure] = blockComponent.$$children;

	if (
		!figure ||
		figure.$$editorRole !== htmlLayoutName ||
		figure.$$localName !== "figure"
	) {
		throw new Error("BlockComponent's first child must be the figure.");
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
