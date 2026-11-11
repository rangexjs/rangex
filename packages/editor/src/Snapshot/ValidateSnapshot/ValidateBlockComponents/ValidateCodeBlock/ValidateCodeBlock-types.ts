import type {
	ComponentDraft,
	DetachedContextDraft,
	HTMLLayoutDraft,
	ListDraft,
	ListItemDraft,
} from "@rangex/core";
import type {
	CodeBlockAttrValidators,
	CreateCodeBlockAttrValidatorsParams,
} from "#dom-attrs";
import type { CodeBlockStorage } from "#storage";
import type { ValidateStorageFn } from "../../_Utilities";
import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateLineNumberParams {
	componentDraft: ComponentDraft;
	detachedContextDraft: DetachedContextDraft;
	index: number;
}

export type ValidateLineNumberResult = ValidateComponentResult;

export interface ValidateListItemParams {
	componentDraft: ComponentDraft;
	listItemDraft: ListItemDraft;
	index: number;
}

export type ValidateListItemResult = ValidateComponentResult;

export interface ValidateListParams {
	componentDraft: ComponentDraft;
	listDraft: ListDraft;
}

export type ValidateListResult = ValidateComponentResult;

export interface ValidateCodeParams {
	componentDraft: ComponentDraft;
	htmlLayoutDraft: HTMLLayoutDraft;
}

export type ValidateCodeResult = ValidateComponentResult;

export interface ValidatePreParams {
	componentDraft: ComponentDraft;
	htmlLayoutDraft: HTMLLayoutDraft;
}

export type ValidatePreResult = ValidateComponentResult;

export interface ValidateCodeBlockParams extends ValidateComponentParams {
	attrValidators: CodeBlockAttrValidators;
	validateStorage: ValidateStorageFn<CodeBlockStorage> | undefined;
}

export type ValidateCodeBlockResult = ValidateComponentResult;

export interface CreateCodeBlockValidatorParams {
	attrValidators?: CreateCodeBlockAttrValidatorsParams;
	validateStorage?: ValidateStorageFn<CodeBlockStorage>;
}

export type CreateCodeBlockValidatorResult = ComponentValidator;
