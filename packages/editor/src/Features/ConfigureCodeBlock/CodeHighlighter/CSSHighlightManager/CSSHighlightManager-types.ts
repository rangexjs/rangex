import type { List } from "rich-text-area";

export type CodeBlockMap = WeakMap<
	List,
	{ highlight: Highlight; range: Range }[]
>;

export interface CSSHighlightManagerConstructorParams {}

export interface AddHighlightParams {
	list: List;
	theme: { light: string; dark: string };
	range: Range;
}

export interface ClearParams {
	list: List;
}
