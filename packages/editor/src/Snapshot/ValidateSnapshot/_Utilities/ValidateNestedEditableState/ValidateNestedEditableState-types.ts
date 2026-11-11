import type {
	ComponentDraft,
	NestedEditableDraft,
	NestedEditableSnapshot,
} from "@rangex/core";
import type { JSONPattern } from "#utilities";
import type { ValidateComponentResult } from "../../ValidateSnapshot-types";

export type NestedEditableState = Omit<
	NestedEditableSnapshot,
	"uniqueId" | "childNodes"
>;

export interface ValidateNestedEditableStateParams {
	componentDraft: ComponentDraft;
	nestedEditableDraft: NestedEditableDraft;
	expectedState: JSONPattern<NestedEditableState>;
}

export type ValidateNestedEditableStateResult = ValidateComponentResult;
