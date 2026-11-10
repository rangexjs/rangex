import type { MediaType } from "@rangex/editor";

export type ProbeableMediaType = "image" | "video" | "audio";

export interface ProbeMediaTypeParams {
	src: string;
	supportedMediaTypes: MediaType[];
	signal?: AbortSignal;
	timeoutMs?: number;
}

export type ProbeMediaTypeResult = Promise<ProbeableMediaType | null>;
