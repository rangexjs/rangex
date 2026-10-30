import type { MediaType } from "@rangex/editor";

export interface DetectMediaFileTypeParams {
	file: File;
	supportedMediaTypes: MediaType[];
}

export type DetectMediaFileTypeResult = Exclude<MediaType, "embed"> | null;
