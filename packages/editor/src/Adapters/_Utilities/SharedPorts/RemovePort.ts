export type OnRemoveCallbackFn = () => void;

export interface RemovePort {
	onRemove(callback: OnRemoveCallbackFn): () => void;
}
