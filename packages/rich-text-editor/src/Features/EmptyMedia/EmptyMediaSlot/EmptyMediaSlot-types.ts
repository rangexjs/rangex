import type { RangeXEditor } from "@rangex/editor";
import type { MediaResolveDetailSettings } from "../_Utilities";

export type SlotStatus =
	| { status: "idle" }
	| { status: "uploading"; progress: number }
	| { status: "checking" }
	| { status: "error"; message: string };

export interface UploadMediaFileParams {
	file: File;
	onProgress: (progress: number) => void;
	signal: AbortSignal;
}

// Resolves to the uploaded file's URL, or null if it couldn't be uploaded
export type UploadMediaFileFn = (
	params: UploadMediaFileParams,
) => Promise<string | null>;

export interface EmptyMediaSlotSettings extends MediaResolveDetailSettings {
	// Uploads a picked or dropped file (e.g. to the app's storage)
	uploadFile: UploadMediaFileFn;
	// Turns a pasted embed URL into the one to frame (e.g. a share link into its embed URL)
	transformEmbedURL?: (url: string) => string;
}

export interface EmptyMediaSlotProps {
	editor: RangeXEditor;
	container: HTMLDivElement;
	settings: EmptyMediaSlotSettings;
}
