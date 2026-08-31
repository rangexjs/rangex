export type OnDeleteCallbackFn = () => void;

export interface DeletePort {
	onDelete(callback: OnDeleteCallbackFn): () => void;
}
