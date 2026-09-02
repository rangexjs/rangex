export type BlockAlignValue = "left" | "center" | "right";

export type OnAlignChangeCallbackFn = (align: BlockAlignValue) => void;

export interface BlockAlignPort {
	onAlignChange(callback: OnAlignChangeCallbackFn): () => void;
	setAlign(align: BlockAlignValue): void;
}
