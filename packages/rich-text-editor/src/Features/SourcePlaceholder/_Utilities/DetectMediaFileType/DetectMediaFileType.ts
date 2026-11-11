import type {
	DetectMediaFileTypeParams,
	DetectMediaFileTypeResult,
} from "./DetectMediaFileType-types";

/*
 * Returns the supported media type of a picked or dropped file, or null if it has none.
 */
export const detectMediaFileType = ({
	file,
	supportedMediaTypes,
}: DetectMediaFileTypeParams): DetectMediaFileTypeResult => {
	if (file.type.startsWith("image/") && supportedMediaTypes.includes("image")) {
		return "image";
	}
	if (file.type.startsWith("video/") && supportedMediaTypes.includes("video")) {
		return "video";
	}
	if (file.type.startsWith("audio/") && supportedMediaTypes.includes("audio")) {
		return "audio";
	}
	return null;
};
