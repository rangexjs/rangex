export type OnDeleteFn = () => void;

export interface DeletePort {
	onDelete(callback: OnDeleteFn): () => void;
}
