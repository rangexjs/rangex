import type { ComponentDraft, ListDraft, ListItemDraft } from "@rangex/core";
import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateListItemParams {
	componentDraft: ComponentDraft;
	listItemDraft: ListItemDraft;
}

export type ValidateListItemResult = ValidateComponentResult;

export interface ValidateListNodeParams {
	componentDraft: ComponentDraft;
	listDraft: ListDraft;
}

export type ValidateListNodeResult = ValidateComponentResult;

export interface ValidateListParams extends ValidateComponentParams {}

export type ValidateListResult = ValidateComponentResult;

export interface CreateListValidatorParams {}

export type CreateListValidatorResult = ComponentValidator;
