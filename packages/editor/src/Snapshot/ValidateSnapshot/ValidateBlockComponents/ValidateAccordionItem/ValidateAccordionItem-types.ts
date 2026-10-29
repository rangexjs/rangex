import type {
	ComponentDraft,
	DetachedContextDraft,
	DetachedContextSnapshot,
	HTMLLayoutDraft,
} from "@rangex/core";
import type {
	AccordionItemAttrValidators,
	CreateAccordionItemAttrValidatorsParams,
} from "#dom-attrs";
import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

// Without domAttrs: they're resolved by an empty shape (see resolveDraftDOMAttrs). The shadow tree is left to the Sanitizer
export type DetachedContextState = Omit<
	DetachedContextSnapshot,
	"uniqueId" | "childNodes" | "domAttrs" | "shadowTreeSnapshot"
>;

export interface ValidateChevronParams {
	componentDraft: ComponentDraft;
	detachedContextDraft: DetachedContextDraft;
}

export type ValidateChevronResult = ValidateComponentResult;

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
