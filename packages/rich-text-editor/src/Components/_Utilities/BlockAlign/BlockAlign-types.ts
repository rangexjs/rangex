import type { BlockNestedContextLine } from "rich-text-area";
import type { blockAlignAttr } from "../../../Constants";

export type BlockAlignValue = keyof typeof blockAlignAttr.value;

export interface GetBlockAlignParams {
	blockNestedContextLine: BlockNestedContextLine;
}

export type GetBlockAlignResult = BlockAlignValue;

export interface SetBlockAlignParams {
	blockNestedContextLine: BlockNestedContextLine;
	align: BlockAlignValue;
}
