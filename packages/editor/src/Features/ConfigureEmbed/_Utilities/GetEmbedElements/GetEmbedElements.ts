import { htmlLayoutRole } from "@rangex/core";
import type {
	GetEmbedElementParams,
	GetEmbedElementResult,
	GetEmbedFigureParams,
	GetEmbedFigureResult,
} from "./GetEmbedElements-types";

/*
 * Returns the block component's figure element, throwing if the first child isn't a figure.
 */
export const getEmbedFigure = ({
	blockComponent,
}: GetEmbedFigureParams): GetEmbedFigureResult => {
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
 * Returns the iframe element nested inside a figure, throwing if none is found.
 */
export const getEmbedElement = ({
	figure,
}: GetEmbedElementParams): GetEmbedElementResult => {
	for (const child of figure.$$children) {
		if (
			child.$$editorRole === htmlLayoutRole &&
			child.$$localName === "iframe"
		) {
			return child;
		}
	}

	throw new Error("Figure must contain an iframe.");
};
