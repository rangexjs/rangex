import type { BlockComponentLine } from "@rangex/core";

import type { blockAlignAttr } from "#constants";

export type BlockAlignValue = keyof typeof blockAlignAttr.value;

export interface GetBlockAlignParams {
	blockComponentLine: BlockComponentLine;
}

export type GetBlockAlignResult = BlockAlignValue;

export interface SetBlockAlignParams {
	blockComponentLine: BlockComponentLine;
	align: BlockAlignValue;
}
