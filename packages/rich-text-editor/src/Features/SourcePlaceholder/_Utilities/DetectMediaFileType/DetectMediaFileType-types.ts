import type { MediaType, SourceType } from "@rangex/editor";

export interface DetectMediaFileTypeParams {
  file: File;
  supportedSourceTypes: SourceType[];
}

export type DetectMediaFileTypeResult = MediaType | null;
