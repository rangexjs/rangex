import type { CreateRootEditableFrom, StoredSnapshot } from "rich-text-area";

export interface CreateRootEditableFromParams {
	storedSnapshot: StoredSnapshot | undefined;
}

export type CreateRootEditableFromResult = CreateRootEditableFrom;

export interface CreateRangeXParams {
	storedSnapshot: StoredSnapshot | undefined;
}
