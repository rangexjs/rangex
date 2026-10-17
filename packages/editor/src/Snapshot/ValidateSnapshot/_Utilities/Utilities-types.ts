import type { ComponentDraft, EditorNodeDraft } from "@rangex/core";
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
