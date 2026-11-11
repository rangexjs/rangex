import { blockComponentLineRole, htmlLayoutRole } from "@rangex/core";

import type { GetMediaPartsParams, GetMediaPartsResult } from "./GetMediaParts-types";

/*
 * Returns a media component's (Image, Video, Audio, Embed) parts: its line, the BlockComponentLine it's in, its block,
 * the BlockComponent itself, and its media, the HTMLLayout of the given localName (e.g. `img`) inside the `figure`
 * HTMLLayout that must be its first child.
 */
export const getMediaParts = ({
	blockComponent,
	mediaLocalName,
}: GetMediaPartsParams): GetMediaPartsResult => {
	const line = blockComponent.$$parentElement;

	if (line?.$$editorRole !== blockComponentLineRole) {
		throw new Error("Media must be in a BlockComponentLine.");
	}

	const [figure] = blockComponent.$$children;

	if (!figure || figure.$$editorRole !== htmlLayoutRole || figure.$$localName !== "figure") {
		throw new Error("Media's first child must be the figure.");
	}

	for (const child of figure.$$children) {
		if (child.$$editorRole === htmlLayoutRole && child.$$localName === mediaLocalName) {
			return { line, block: blockComponent, media: child };
		}
	}

	throw new Error(`Media's figure must contain a ${mediaLocalName}.`);
};
