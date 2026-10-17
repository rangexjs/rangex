import type { ComponentDraft, DOMAttrs, EditorNodeDraft } from "@rangex/core";
import type { DOMAttrsMismatch } from "#attr-rules";
import type { JSONMismatch } from "#utilities";

export interface FormatNodePathParams {
	componentDraft: ComponentDraft;
	nodeDraft: EditorNodeDraft;
}

export interface DescribeJSONMismatchParams {
	componentDraft: ComponentDraft;
	nodeDraft: EditorNodeDraft;
	value: unknown;
	mismatch: JSONMismatch;
}

export interface DescribeDOMAttrsMismatchParams {
	componentDraft: ComponentDraft;
	nodeDraft: EditorNodeDraft;
	domAttrs: DOMAttrs;
	mismatch: DOMAttrsMismatch;
}
