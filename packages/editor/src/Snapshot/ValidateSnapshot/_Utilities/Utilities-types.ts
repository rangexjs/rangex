import type {
	DOMAttrs,
	EditorElementDraft,
	EditorNodeDraft,
} from "@rangex/core";
import type { ElementAttrsMismatch } from "#dom-attrs";
import type { JSONMismatch } from "#utilities";

export interface FormatNodeSegmentParams {
	rootDraft: EditorElementDraft;
	nodeDraft: EditorNodeDraft;
}

export interface FormatNodePathParams {
	rootDraft: EditorElementDraft;
	nodeDraft: EditorNodeDraft;
}

export interface DescribeJSONMismatchParams {
	rootDraft: EditorElementDraft;
	nodeDraft: EditorNodeDraft;
	value: unknown;
	mismatch: JSONMismatch;
}

export interface DescribeElementAttrsMismatchParams {
	rootDraft: EditorElementDraft;
	nodeDraft: EditorNodeDraft;
	domAttrs: DOMAttrs;
	mismatch: ElementAttrsMismatch;
}
