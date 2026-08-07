import type { RangeX, StoredSnapshot } from "rich-text-area";

export interface CreateRootEditableFromParams {
	storedSnapshot: StoredSnapshot | undefined;
}

export type CreateRootEditableFromResult = ConstructorParameters<
	typeof RangeX
>["0"]["rootEditableFrom"];

export interface CreateRangeXParams {
	storedSnapshot: StoredSnapshot | undefined;
}
