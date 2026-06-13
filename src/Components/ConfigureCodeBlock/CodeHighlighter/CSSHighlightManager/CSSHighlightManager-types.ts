import type { NestedEditable } from "rich-text-area";

export type CodeBlockMap = WeakMap<
	NestedEditable,
	{ highlight: Highlight; range: Range }[]
>;

export interface CSSHighlightManagerConstructorParams {}

export interface AddHighlightParams {
	nestedEditable: NestedEditable;
	theme: { light: string; dark: string };
	range: Range;
}

export interface ClearParams {
	nestedEditable: NestedEditable;
}
