import type { MediaType } from "@rangex/editor";

export interface DetectMediaFileTypeParams {
	file: File;
	supportedMediaTypes: MediaType[];
}

export type MediaFileType = Exclude<MediaType, "embed">;

export type DetectMediaFileTypeResult = MediaFileType | null;
