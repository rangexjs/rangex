import type { RootEditable } from "rich-text-area";

export interface RootEditableStorage {
	templateVariable: Record<string, unknown>;
}

export interface EnsureRootEditableStorageParams {
	rootEditable: RootEditable;
}

export interface EnsureRootEditableStorageResult extends RootEditableStorage {}
