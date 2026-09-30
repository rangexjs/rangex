import { htmlLayoutRole } from "rich-text-area";
import type {
	GetVideoElementParams,
	GetVideoElementResult,
	GetVideoFigureParams,
	GetVideoFigureResult,
} from "./GetVideoElements-types";

/*
 * Returns the block component's figure element, throwing if the first child isn't a figure.
 */
export const getVideoFigure = ({
	blockComponent,
}: GetVideoFigureParams): GetVideoFigureResult => {
	const [figure] = blockComponent.$$children;

	if (
		!figure ||
		figure.$$editorRole !== htmlLayoutRole ||
		figure.$$localName !== "figure"
	) {
		throw new Error("BlockComponent's first child must be the figure.");
	}

	return figure;
};

/*
 * Returns the video element nested inside a figure, throwing if none is found.
 */
export const getVideoElement = ({
	figure,
}: GetVideoElementParams): GetVideoElementResult => {
	for (const child of figure.$$children) {
		if (
			child.$$editorRole === htmlLayoutRole &&
			child.$$localName === "video"
		) {
			return child;
		}
	}

	throw new Error("Figure must contain a video.");
};
