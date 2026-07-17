export interface OnResizeMoveParams {
	deltaPx: number;
	side: "left" | "right";
}

export type OnResizeMoveFn = (params: OnResizeMoveParams) => void;
export type OnResizeEndFn = () => void;

export type UpdateHandleXFn = (x: number) => void;

export interface BlockResizePopover {
	popover: HTMLDivElement;
	onResizeMove(callback: OnResizeMoveFn): () => void;
	onResizeEnd(callback: OnResizeEndFn): () => void;
	updateHandleX(x: number): void;
}
