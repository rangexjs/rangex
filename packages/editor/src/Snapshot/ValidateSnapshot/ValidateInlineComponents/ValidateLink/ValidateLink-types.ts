import type { HTMLLayoutDraft, InlineComponentDraft } from "@rangex/core";
import type {
	CreateLinkAttrValidatorsParams,
	LinkAttrValidators,
} from "#dom-attrs";
import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateAnchorParams {
	componentDraft: InlineComponentDraft;
	htmlLayoutDraft: HTMLLayoutDraft;
	anchorAttrValidators: LinkAttrValidators["anchor"];
}

export type ValidateAnchorResult = ValidateComponentResult;

export interface ValidateLinkParams extends ValidateComponentParams {
	attrValidators: LinkAttrValidators;
}

export type ValidateLinkResult = ValidateComponentResult;

export interface CreateLinkValidatorParams {
	attrValidators?: CreateLinkAttrValidatorsParams;
}

export type CreateLinkValidatorResult = ComponentValidator;
