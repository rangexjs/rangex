import type { InlineComponentView } from "rich-text-area";
import type { DOMChildNode } from "../../CreateHTMLFromSnapshotView-types";

export interface CreateInlineComponentHTMLParams {
	inlineComponentView: InlineComponentView;
	childNodes: DOMChildNode[];
}

export type CreateInlineComponentHTMLResult = HTMLElement;
