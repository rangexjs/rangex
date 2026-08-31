export type OnDuplicateFn = () => void;

export interface DuplicatePort {
	onDuplicate(callback: OnDuplicateFn): () => void;
}
