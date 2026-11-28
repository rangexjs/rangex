import type {
  DetectMediaFileTypeParams,
  DetectMediaFileTypeResult,
} from "./DetectMediaFileType-types";

/*
 * Returns the supported media type of a picked or dropped file, or null if it has none.
 */
export const detectMediaFileType = ({
  file,
  supportedSourceTypes,
}: DetectMediaFileTypeParams): DetectMediaFileTypeResult => {
  if (file.type.startsWith("image/") && supportedSourceTypes.includes("image")) {
    return "image";
  }
  if (file.type.startsWith("video/") && supportedSourceTypes.includes("video")) {
    return "video";
  }
  if (file.type.startsWith("audio/") && supportedSourceTypes.includes("audio")) {
    return "audio";
  }
  return null;
};
