import type { ComponentDraft, RootEditableDraft } from "@rangex/core";

export interface GetDisplayContentLineParams {
	componentDraft: ComponentDraft;
}

export interface ResolveTemplateVariableTextsParams {
	rootEditableDraft: RootEditableDraft;
}
