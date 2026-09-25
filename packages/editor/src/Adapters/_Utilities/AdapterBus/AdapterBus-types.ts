import type { AdapterName } from "../Utilities-types";

export type MediaType = Extract<
	AdapterName,
	"image" | "video" | "audio" | "embed"
>;

export interface MediaResolveCallbackParams {
	type: MediaType;
	src: string;
}

export type OnMediaResolveCallbackFn = (
	params: MediaResolveCallbackParams,
) => void;

export type OnSwapToEmptyMediaCallbackFn = () => void;
