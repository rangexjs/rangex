import type { ContentFlowNode, RootEditable } from "@rangex/core";

import type { FocusPosition } from "../SelectionNamespace-types";

export interface GetPositionBoundaryPointsParams {
  position: Exclude<FocusPosition, "current">;
  rootEditable: RootEditable;
}

export interface GetPositionBoundaryPointsResult {
  fromNode: ContentFlowNode;
  fromOffset: number;
  toNode: ContentFlowNode;
  toOffset: number;
}
