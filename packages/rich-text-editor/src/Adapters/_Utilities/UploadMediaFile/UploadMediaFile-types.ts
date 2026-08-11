export interface UploadMediaFileParams {
	file: File;
	onProgress?: (progress: number) => void;
}

/**
 * Consumer-supplied hook for getting an uploaded file's bytes somewhere durable (a blob
 * storage bucket, an app server endpoint, ...) and back a URL the engine can use as a
 * component's `src`. Resolves `null` on failure — the caller surfaces that as an error state.
 */
export type UploadMediaFileFn = (
	params: UploadMediaFileParams,
) => Promise<string | null>;
