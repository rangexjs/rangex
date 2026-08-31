export type InsertRootLinePosition = "above" | "below";

export type OnInsertRootLineFn = (position: InsertRootLinePosition) => void;

export interface InsertRootLinePort {
	onInsertRootLine(callback: OnInsertRootLineFn): () => void;
}
