import type { InlineNestedContextView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateInlineNestedContextHTMLParams {
	inlineNestedContextView: InlineNestedContextView;
	childNodes: DOMChildNode[];
}

export type CreateInlineNestedContextHTMLResult = HTMLElement;
