import type {
	BundledLangKeys,
	DualTheme,
	HighlightInfo,
} from "../SyntaxHighlighter-types";

export interface TokensRequest {
	id: number;
	type: "tokens";
	lines: string[];
	lang: BundledLangKeys;
}

export interface HTMLRequest {
	id: number;
	type: "html";
	code: string;
	lang: BundledLangKeys;
	theme: DualTheme;
}

export type WorkerRequest = TokensRequest | HTMLRequest;

export interface TokensResponse {
	id: number;
	type: "tokens";
	result: HighlightInfo;
}

export interface HTMLResponse {
	id: number;
	type: "html";
	result: string;
}

export type WorkerResponse = TokensResponse | HTMLResponse;
