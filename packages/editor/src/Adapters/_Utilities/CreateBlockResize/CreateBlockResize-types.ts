interface ResizeMove {
	deltaPx: number;
	side: "left" | "right";
}

export interface ResizeMoveParams extends ResizeMove {}

export type ResizeMoveFn = (params: ResizeMoveParams) => void;
export type ResizeEndFn = () => void;

export interface HandleParams {
	side: "left" | "right";
	xPos: number;
	resizeMove: ResizeMoveFn;
	resizeEnd: ResizeEndFn;
}

export interface BlockResize {
	readonly element: HTMLDivElement;
	onResizeMove(callback: ResizeMoveFn): () => void;
	onResizeEnd(callback: ResizeEndFn): () => void;
}

export interface CreateBlockResizeParams {
	floatingContainer: HTMLDivElement;
	xPos: number;
}

export interface CreateBlockResizeResult extends BlockResize {}
