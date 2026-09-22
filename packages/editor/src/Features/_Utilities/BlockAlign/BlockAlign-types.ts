import type { BlockComponentLine } from "rich-text-area";
import type { blockAlignAttr } from "#engine-links";

export type BlockAlignValue = keyof typeof blockAlignAttr.value;

export interface GetBlockAlignParams {
	blockComponentLine: BlockComponentLine;
}

export type GetBlockAlignResult = BlockAlignValue;

export interface SetBlockAlignParams {
	blockComponentLine: BlockComponentLine;
	align: BlockAlignValue;
}
