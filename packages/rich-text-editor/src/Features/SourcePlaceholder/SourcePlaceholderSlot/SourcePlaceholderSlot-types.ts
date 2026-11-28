import type { FileId, RangeXEditor } from "@rangex/editor";

import type { DetectSourceUrlTypeSettings } from "../_Utilities";

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

export interface UploadedMediaFile {
  src: string;
  fileId: FileId;
}

// Resolves to the uploaded file's URL and its id in the app's storage, or null if it couldn't be uploaded
export type UploadMediaFileFn = (
  params: UploadMediaFileParams,
) => Promise<UploadedMediaFile | null>;

export interface SourcePlaceholderSlotSettings extends DetectSourceUrlTypeSettings {
  // Uploads a picked or dropped file (e.g. to the app's storage)
  uploadFile: UploadMediaFileFn;
}

export interface SourcePlaceholderSlotProps {
  editor: RangeXEditor;
  container: HTMLDivElement;
  settings: SourcePlaceholderSlotSettings;
}
