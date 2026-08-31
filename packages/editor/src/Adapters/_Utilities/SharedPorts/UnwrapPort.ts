export type OnUnwrapCallbackFn = () => void;

export interface UnwrapPort {
	onUnwrap(callback: OnUnwrapCallbackFn): () => void;
}
