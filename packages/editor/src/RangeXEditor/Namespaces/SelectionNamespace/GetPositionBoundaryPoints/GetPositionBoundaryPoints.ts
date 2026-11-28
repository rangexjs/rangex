import { assertNever } from "#utilities";

import type {
  GetPositionBoundaryPointsParams,
  GetPositionBoundaryPointsResult,
} from "./GetPositionBoundaryPoints-types";

/*
 * Returns the boundary points of the given focus position within the RootEditable: collapsed at its start or end, or
 * spanning all of it.
 */
export const getPositionBoundaryPoints = ({
  position,
  rootEditable,
}: GetPositionBoundaryPointsParams): GetPositionBoundaryPointsResult => {
  const endOffset = rootEditable.$$childNodes.length;

  if (position === "start") {
    return { fromNode: rootEditable, fromOffset: 0, toNode: rootEditable, toOffset: 0 };
  }

  if (position === "end") {
    return {
      fromNode: rootEditable,
      fromOffset: endOffset,
      toNode: rootEditable,
      toOffset: endOffset,
    };
  }

  if (position === "all") {
    return { fromNode: rootEditable, fromOffset: 0, toNode: rootEditable, toOffset: endOffset };
  }

  return assertNever(position);
};
