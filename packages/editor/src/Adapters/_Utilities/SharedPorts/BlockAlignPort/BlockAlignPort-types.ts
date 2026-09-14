export type BlockAlignValue = "left" | "center" | "right";

export interface BlockAlignInternals {
	align: BlockAlignValue;
}

export interface UpdateStateParams {
	align?: BlockAlignValue;
}

export type OnChangeAlignCallbackFn = (align: BlockAlignValue) => void;

export interface BlockAlignConfigPort {
	updateAlign(align: BlockAlignValue): void;

	onChangeAlign(callback: OnChangeAlignCallbackFn): () => void;
}

export type OnAlignUpdateCallbackFn = (value: BlockAlignValue) => void;

export interface BlockAlignPublicPort {
	readonly align: BlockAlignValue;

	onAlignUpdate(callback: OnAlignUpdateCallbackFn): () => void;

	changeAlign(align: BlockAlignValue): void;
}

export interface BlockAlignPort {
	configPort: BlockAlignConfigPort;
	publicPort: BlockAlignPublicPort;
}

export interface CreateBlockAlignPortResult extends BlockAlignPort {}
