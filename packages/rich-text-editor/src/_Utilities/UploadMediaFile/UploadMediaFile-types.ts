export interface UploadMediaFileParams {
	file: File;
	onProgress?: (progress: number) => void;
}

export type UploadMediaFileResult = Promise<string | null>;
