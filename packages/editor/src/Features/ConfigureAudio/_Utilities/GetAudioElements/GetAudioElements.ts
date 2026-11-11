import { htmlLayoutRole } from "@rangex/core";

import type {
	GetAudioElementParams,
	GetAudioElementResult,
	GetAudioFigureParams,
	GetAudioFigureResult,
} from "./GetAudioElements-types";

/*
 * Returns the block component's figure element, throwing if the first child isn't a figure.
 */
export const getAudioFigure = ({ blockComponent }: GetAudioFigureParams): GetAudioFigureResult => {
	const [figure] = blockComponent.$$children;

	if (!figure || figure.$$editorRole !== htmlLayoutRole || figure.$$localName !== "figure") {
		throw new Error("BlockComponent's first child must be the figure.");
	}

	return figure;
};

/*
 * Returns the audio element nested inside a figure, throwing if none is found.
 */
export const getAudioElement = ({ figure }: GetAudioElementParams): GetAudioElementResult => {
	for (const child of figure.$$children) {
		if (child.$$editorRole === htmlLayoutRole && child.$$localName === "audio") {
			return child;
		}
	}

	throw new Error("Figure must contain an audio.");
};
