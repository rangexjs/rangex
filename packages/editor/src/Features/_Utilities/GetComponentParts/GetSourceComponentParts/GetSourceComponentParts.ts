import { blockComponentLineRole, htmlLayoutRole } from "@rangex/core";

import type {
  GetSourceComponentPartsParams,
  GetSourceComponentPartsResult,
} from "./GetSourceComponentParts-types";

/*
 * Returns a source component's (Image, Video, Audio, Embed) parts: its line, the BlockComponentLine it's in, its block,
 * the BlockComponent itself, and its source element, the HTMLLayout of the given localName (e.g. `img`) inside the
 * `figure` HTMLLayout that must be its first child.
 */
export const getSourceComponentParts = ({
  blockComponent,
  sourceElementLocalName,
}: GetSourceComponentPartsParams): GetSourceComponentPartsResult => {
  const line = blockComponent.$$parentElement;

  if (line?.$$editorRole !== blockComponentLineRole) {
    throw new Error("Source component must be in a BlockComponentLine.");
  }

  const [figure] = blockComponent.$$children;

  if (!figure || figure.$$editorRole !== htmlLayoutRole || figure.$$localName !== "figure") {
    throw new Error("Source component's first child must be the figure.");
  }

  for (const child of figure.$$children) {
    if (child.$$editorRole === htmlLayoutRole && child.$$localName === sourceElementLocalName) {
      return { line, block: blockComponent, sourceElement: child };
    }
  }

  throw new Error(`Source component's figure must contain a ${sourceElementLocalName}.`);
};
