export type MediaType = "image" | "video" | "audio" | "embed";

export interface MediaResolveCallbackParams {
	type: MediaType;
	src: string;
}

export type OnMediaResolveCallbackFn = (
	params: MediaResolveCallbackParams,
) => void;
