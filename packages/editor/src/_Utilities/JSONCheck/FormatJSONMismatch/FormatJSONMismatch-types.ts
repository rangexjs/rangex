import type { JSONMismatch, JSONMismatchPath } from "../MatchJSON";

export interface FormatJSONMismatchParams {
	value: unknown;
	mismatch: JSONMismatch;
}

export type FormatJSONMismatchResult = string;

export interface FindValueAtPathParams {
	value: unknown;
	path: JSONMismatchPath;
}
