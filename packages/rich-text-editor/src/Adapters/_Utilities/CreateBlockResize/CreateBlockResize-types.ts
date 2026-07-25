import type { OverlayHost } from "#ports";

interface ResizeMove {
	deltaPx: number;
	side: "left" | "right";
}

export interface EmitResizeMoveParams extends ResizeMove {}

export type OnHandleXUpdateFn = (x: number) => void;

export interface UIBlockResize {
	setElement: (element: HTMLDivElement) => void;
	readonly handleX: number;
	onHandleXUpdate(callback: OnHandleXUpdateFn): () => void;
	emitResizeMove(params: EmitResizeMoveParams): void;
	emitResizeEnd(): void;
}

export interface OnResizeMoveParams extends ResizeMove {}

export type OnResizeMoveFn = (params: OnResizeMoveParams) => void;
export type OnResizeEndFn = () => void;

export interface EditorBlockResize {
	readonly element: HTMLDivElement;
	readonly isMounted: boolean;
	mount(): void;
	unmount(): void;
	updateHandleX(x: number): void;
	onResizeMove(callback: OnResizeMoveFn): () => void;
	onResizeEnd(callback: OnResizeEndFn): () => void;
}

export interface BlockResize {
	uiBlockResize: UIBlockResize;
	editorBlockResize: EditorBlockResize;
}

export interface CreateBlockResizeParams {
	overlayHost: OverlayHost;
}

export interface CreateBlockResizeResult extends BlockResize {}
