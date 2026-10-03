import type { CreateRootEditableFrom, StoredSnapshot } from "@rangex/core";

export interface CreateRootEditableFromParams {
	storedSnapshot: StoredSnapshot | undefined;
}

export type CreateRootEditableFromResult = CreateRootEditableFrom;

export interface CreateCoreParams {
	licenseKey: string;
	storedSnapshot: StoredSnapshot | undefined;
}
