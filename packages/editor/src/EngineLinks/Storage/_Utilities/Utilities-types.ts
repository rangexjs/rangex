export interface StorageFields {
	id: string;
	version: number;
}

export type ValidateStorageCallbackFn = (storage: unknown) => boolean;
