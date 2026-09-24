export interface IsStorageParams {
	id: string;
}

export type ValidateStorageCallbackFn = (storage: unknown) => boolean;
