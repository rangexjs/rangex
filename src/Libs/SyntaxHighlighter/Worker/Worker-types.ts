import type {
	BundledLangKeys,
	HighlightInfo,
} from "../SyntaxHighlighter-types";

export interface WorkerRequest {
	id: number;
	lines: string[];
	lang: BundledLangKeys;
}

export interface WorkerResponse {
	id: number;
	result: HighlightInfo;
}
