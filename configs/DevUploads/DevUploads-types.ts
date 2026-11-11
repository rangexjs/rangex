export interface DevUpload {
	contentType: string;
	data: Uint8Array;
}

export interface ByteRange {
	start: number;
	end: number;
}
