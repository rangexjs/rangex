import { htmlLayoutName } from "rich-text-area";
import type {
	GetEmbedFigureParams,
	GetEmbedFigureResult,
	GetEmbedIframeParams,
	GetEmbedIframeResult,
} from "./GetEmbedElements-types";

export const getEmbedFigure = ({
	blockComponent,
}: GetEmbedFigureParams): GetEmbedFigureResult => {
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

export const getEmbedIframe = ({
	figure,
}: GetEmbedIframeParams): GetEmbedIframeResult => {
	for (const child of figure.$$children) {
		if (
			child.$$editorRole === htmlLayoutName &&
			child.$$localName === "iframe"
		) {
			return child;
		}
	}

	throw new Error("Figure must contain an iframe.");
};
