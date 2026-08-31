interface ResizeMove {
	deltaPx: number;
	side: "left" | "right";
}

export interface OnResizeMoveParams extends ResizeMove {}

export type OnResizeMoveFn = (params: OnResizeMoveParams) => void;
export type OnResizeEndFn = () => void;

export interface ConfigBlockResize {
	readonly element: HTMLDivElement;
	onResizeMove(callback: OnResizeMoveFn): () => void;
	onResizeEnd(callback: OnResizeEndFn): () => void;
}

export interface EmitResizeMoveParams extends ResizeMove {}

export type OnHandleXUpdateFn = (x: number) => void;

export interface PublicBlockResize {
	readonly handleX: number;
	updateHandleX(x: number): void;
}

export interface BlockResize {
	configBlockResize: ConfigBlockResize;
	publicBlockResize: PublicBlockResize;
}

export interface CreateBlockResizeParams {
	floatingContainer: HTMLDivElement;
}

export interface CreateBlockResizeResult extends BlockResize {}
