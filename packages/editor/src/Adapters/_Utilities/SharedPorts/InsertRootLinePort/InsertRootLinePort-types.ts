export type InsertRootLinePosition = "above" | "below";

export type OnInsertRootLineCallbackFn = (
	position: InsertRootLinePosition,
) => void;

export interface InsertRootLineConfigPort {
	onInsertRootLine(callback: OnInsertRootLineCallbackFn): () => void;
}

export interface InsertRootLinePublicPort {
	insertRootLine(position: InsertRootLinePosition): void;
}

export interface InsertRootLinePort {
	configPort: InsertRootLineConfigPort;
	publicPort: InsertRootLinePublicPort;
}

export interface CreateInsertRootLinePortResult extends InsertRootLinePort {}
