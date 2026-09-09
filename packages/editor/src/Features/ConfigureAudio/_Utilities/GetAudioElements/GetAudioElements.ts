import { htmlLayoutName } from "rich-text-area";
import type {
	GetAudioElementParams,
	GetAudioElementResult,
	GetAudioFigureParams,
	GetAudioFigureResult,
} from "./GetAudioElements-types";

export const getAudioFigure = ({
	blockComponent,
}: GetAudioFigureParams): GetAudioFigureResult => {
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

export const getAudioElement = ({
	figure,
}: GetAudioElementParams): GetAudioElementResult => {
	for (const child of figure.$$children) {
		if (
			child.$$editorRole === htmlLayoutName &&
			child.$$localName === "audio"
		) {
			return child;
		}
	}

	throw new Error("Figure must contain an audio.");
};
