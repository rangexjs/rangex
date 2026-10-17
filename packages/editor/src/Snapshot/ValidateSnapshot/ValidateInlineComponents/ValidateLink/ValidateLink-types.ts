import type {
	HTMLLayoutDraft,
	HTMLLayoutSnapshot,
	InlineComponentDraft,
	NestedEditableDraft,
	NestedEditableSnapshot,
} from "@rangex/core";
import type { AnchorAttrRules, LinkAttrRules } from "#attr-rules";
import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export type AnchorState = Omit<
	HTMLLayoutSnapshot,
	"uniqueId" | "childNodes" | "domAttrs"
>;

export type NestedEditableState = Omit<
	NestedEditableSnapshot,
	"uniqueId" | "childNodes"
>;

export interface ValidateAnchorParams {
	linkDraft: InlineComponentDraft;
	htmlLayoutDraft: HTMLLayoutDraft;
	anchorAttrRules: AnchorAttrRules;
}

export type ValidateAnchorResult = ValidateComponentResult;

export interface ValidateNestedEditableParams {
	linkDraft: InlineComponentDraft;
	nestedEditableDraft: NestedEditableDraft;
}

export type ValidateNestedEditableResult = ValidateComponentResult;

export interface ValidateLinkParams extends ValidateComponentParams {
	attrRules: LinkAttrRules;
}

export type ValidateLinkResult = ValidateComponentResult;

export interface CreateLinkValidatorParams {
	attrRules: LinkAttrRules;
}

export type CreateLinkValidatorResult = ComponentValidator;
