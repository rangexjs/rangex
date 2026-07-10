export type BlockAlignValue = "left" | "center" | "right";

export interface ImagePopoverState {
	align?: BlockAlignValue;
}

export interface UpdateImagePopoverStateParams extends ImagePopoverState {}

export type UpdateAlignFn = (value: BlockAlignValue) => void;

export type ImageListenerOption = {
	type: "align";
	callback: UpdateAlignFn;
};

export type ImageUpdateListenerParams = ImageListenerOption & {
	operation: "add" | "delete";
};

export type OnAlignChangeFn = (align: BlockAlignValue) => void;

export interface ImagePopover {
	popover: HTMLDivElement;
	updateState(params: UpdateImagePopoverStateParams): void;
	onAlignChange(callback: OnAlignChangeFn): () => void;
}
