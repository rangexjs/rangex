export type BlockAlignValue = "left" | "center" | "right";

export type OnAlignChangeFn = (align: BlockAlignValue) => void;

export interface BlockAlignPort {
	onAlignChange(callback: OnAlignChangeFn): () => void;
	setAlign(align: BlockAlignValue): void;
}
