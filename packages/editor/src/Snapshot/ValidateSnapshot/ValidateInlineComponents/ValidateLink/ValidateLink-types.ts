import type {
	HTMLLayoutDraft,
	HTMLLayoutSnapshot,
	InlineComponentDraft,
	NestedEditableDraft,
	NestedEditableSnapshot,
} from "@rangex/core";
import type {
	CreateLinkAttrValidatorsParams,
	LinkAttrValidators,
} from "#dom-attrs";
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
	anchorAttrValidators: LinkAttrValidators["anchor"];
}

export type ValidateAnchorResult = ValidateComponentResult;

export interface ValidateNestedEditableParams {
	linkDraft: InlineComponentDraft;
	nestedEditableDraft: NestedEditableDraft;
}

export type ValidateNestedEditableResult = ValidateComponentResult;

export interface ValidateLinkParams extends ValidateComponentParams {
	attrValidators: LinkAttrValidators;
}

export type ValidateLinkResult = ValidateComponentResult;

export interface CreateLinkValidatorParams {
	attrValidators?: CreateLinkAttrValidatorsParams;
}

export type CreateLinkValidatorResult = ComponentValidator;
