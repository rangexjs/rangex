export type ProbeableMediaType = "image" | "video" | "audio";

export interface ProbeMediaSrcParams {
	type: ProbeableMediaType;
	src: string;
	timeoutMs?: number;
}

export type ProbeMediaSrcResult = Promise<boolean>;
