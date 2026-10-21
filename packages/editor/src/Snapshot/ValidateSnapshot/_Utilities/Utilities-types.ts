import type { ComponentDraft, DOMAttrs, EditorNodeDraft } from "@rangex/core";
import type { ElementAttrsMismatch } from "#dom-attrs";
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

export interface DescribeElementAttrsMismatchParams {
	componentDraft: ComponentDraft;
	nodeDraft: EditorNodeDraft;
	domAttrs: DOMAttrs;
	mismatch: ElementAttrsMismatch;
}
