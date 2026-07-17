import type {
	UploadMediaFileParams,
	UploadMediaFileResult,
} from "./UploadMediaFile-types";

// TODO: this is a placeholder — it inlines the file as a base64 data URL via `FileReader`
// instead of going through any upload endpoint or blob storage, same as the approach
// `ConfigureImage`/`ConfigureVideo` use today (see the TODO in `ConfigureImage.ts`). It
// embeds the full file bytes directly in the document and in every snapshot/undo boundary.
// Works for now but isn't viable long term — needs a pluggable upload mechanism
// (consumer-supplied endpoint/blob storage) eventually.
export const uploadMediaFile = ({
	file,
	onProgress,
}: UploadMediaFileParams): UploadMediaFileResult => {
	return new Promise((resolve) => {
		const reader = new FileReader();

		reader.onprogress = (event) => {
			if (event.lengthComputable) {
				onProgress?.(event.loaded / event.total);
			}
		};

		reader.onload = () => {
			resolve(reader.result as string);
		};

		reader.onerror = () => {
			resolve(null);
		};

		reader.readAsDataURL(file);
	});
};
