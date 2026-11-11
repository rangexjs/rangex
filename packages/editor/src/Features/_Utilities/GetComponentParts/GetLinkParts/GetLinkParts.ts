import { htmlLayoutRole } from "@rangex/core";

import type { GetLinkPartsParams, GetLinkPartsResult } from "./GetLinkParts-types";

/*
 * Returns the link's parts: its anchor, the `a` HTMLLayout that must be its first child.
 */
export const getLinkParts = ({ link }: GetLinkPartsParams): GetLinkPartsResult => {
	const [anchor] = link.$$childNodes;

	if (!anchor || anchor.$$editorRole !== htmlLayoutRole || anchor.$$localName !== "a") {
		throw new Error("Link's first child must be the anchor.");
	}

	return { anchor };
};
