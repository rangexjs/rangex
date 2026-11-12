import type { ComponentDraft, HTMLLayoutDraft } from "@rangex/core";

import type {
	AccordionItemAttrValidators,
	CreateAccordionItemAttrValidatorsParams,
} from "#dom-attrs";

import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateSummaryParams {
	componentDraft: ComponentDraft;
	htmlLayoutDraft: HTMLLayoutDraft;
}

export type ValidateSummaryResult = ValidateComponentResult;

export interface ValidateDetailsParams {
	componentDraft: ComponentDraft;
	htmlLayoutDraft: HTMLLayoutDraft;
	attrValidators: AccordionItemAttrValidators;
}

export type ValidateDetailsResult = ValidateComponentResult;

export interface ValidateAccordionItemParams extends ValidateComponentParams {
	attrValidators: AccordionItemAttrValidators;
}

export type ValidateAccordionItemResult = ValidateComponentResult;

export interface CreateAccordionItemValidatorParams {
	attrValidators?: CreateAccordionItemAttrValidatorsParams;
}

export type CreateAccordionItemValidatorResult = ComponentValidator;
