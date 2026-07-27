export type OnUnwrapFn = () => void;

export interface UnwrapPort {
	onUnwrap(callback: OnUnwrapFn): () => void;
}
