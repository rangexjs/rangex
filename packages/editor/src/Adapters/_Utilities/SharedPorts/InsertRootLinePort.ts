export type InsertRootLinePosition = "above" | "below";

export type OnInsertRootLineCallbackFn = (
	position: InsertRootLinePosition,
) => void;

export interface InsertRootLinePort {
	onInsertRootLine(callback: OnInsertRootLineCallbackFn): () => void;
}
