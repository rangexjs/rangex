export type MediaResolveType = "image" | "video" | "audio" | "embed";

export interface MediaResolveParams {
	type: MediaResolveType;
	src: string;
}

export type OnMediaResolveFn = (params: MediaResolveParams) => void;
