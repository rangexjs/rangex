export interface UploadMediaFileParams {
	file: File;
	onProgress: (progress: number) => void;
}

export interface UploadMediaFileResult {
	src: string;
}
