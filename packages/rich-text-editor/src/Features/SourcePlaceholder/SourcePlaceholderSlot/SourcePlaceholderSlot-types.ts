import type { RangeXEditor } from "@rangex/editor";
import type { DetectMediaUrlTypeSettings } from "../_Utilities";

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

export interface SourcePlaceholderSlotSettings
	extends DetectMediaUrlTypeSettings {
	// Uploads a picked or dropped file (e.g. to the app's storage)
	uploadFile: UploadMediaFileFn;
}

export interface SourcePlaceholderSlotProps {
	editor: RangeXEditor;
	container: HTMLDivElement;
	settings: SourcePlaceholderSlotSettings;
}
