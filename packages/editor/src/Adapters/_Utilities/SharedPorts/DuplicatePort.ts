export type OnDuplicateCallbackFn = () => void;

export interface DuplicatePort {
	onDuplicate(callback: OnDuplicateCallbackFn): () => void;
}
