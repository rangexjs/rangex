import type { BlockComponent, BlockComponentLine, HTMLLayout } from "@rangex/core";

export interface GetSourceComponentPartsParams {
  blockComponent: BlockComponent;
  sourceElementLocalName: string;
}

export interface GetSourceComponentPartsResult {
  line: BlockComponentLine;
  block: BlockComponent;
  sourceElement: HTMLLayout;
}
