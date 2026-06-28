import type { RootEditable } from "rich-text-area";
import type { RootId } from "../../Constants";
import type { rootStorageVersion } from "./RootStorage";

export interface RootStorage {
	id: RootId;
	version: typeof rootStorageVersion;
	templateVariable: Record<string, unknown>;
}

export interface CreateRootStorageResult extends RootStorage {}

export interface EnsureRootStorageParams {
	rootEditable: RootEditable;
}

export interface EnsureRootStorageResult extends RootStorage {}
