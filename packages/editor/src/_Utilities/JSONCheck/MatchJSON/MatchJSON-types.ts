import type { optional } from "./MatchJSON";

export type JSONPredicate<Value> = (value: Value) => boolean;

export interface OptionalKeyPattern<Value> {
	readonly [optional]: JSONPattern<Value>;
}

type JSONKeyPattern<Value> =
	| JSONPattern<Exclude<Value, undefined>>
	| OptionalKeyPattern<Exclude<Value, undefined>>;

type JSONObjectPattern<Value extends object> = {
	[Key in keyof Value]-?: JSONKeyPattern<Value[Key]>;
};

type JSONStructurePattern<Value> = Value extends readonly (infer Item)[]
	? JSONPattern<Item>[]
	: Value extends object
		? JSONObjectPattern<Value>
		: Value;

export type JSONPattern<Value> = JSONPredicate<Value> | JSONStructurePattern<Value>;

export type JSONMismatchPath = (string | number)[];

export type JSONMismatchKind = "unknown-key" | "missing-key" | "invalid-value";

export interface JSONMismatch {
	path: JSONMismatchPath;
	kind: JSONMismatchKind;
}

export interface MatchJSONArrayParams {
	value: unknown;
	pattern: unknown[];
	path: JSONMismatchPath;
}

export interface MatchJSONObjectParams {
	value: unknown;
	pattern: Record<string, unknown>;
	path: JSONMismatchPath;
}

export interface MatchJSONAtParams {
	value: unknown;
	pattern: unknown;
	path: JSONMismatchPath;
}

export type MatchJSONAtResult = JSONMismatch | null;

export interface MatchJSONParams<Value> {
	value: Value;
	pattern: NoInfer<JSONPattern<Value>>;
}

export type MatchJSONResult = JSONMismatch | null;
