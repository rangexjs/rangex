export type MediaType = "image" | "video" | "audio" | "embed";

export interface MediaResolveParams {
	type: MediaType;
	src: string;
}

export type OnMediaResolveFn = (params: MediaResolveParams) => void;
