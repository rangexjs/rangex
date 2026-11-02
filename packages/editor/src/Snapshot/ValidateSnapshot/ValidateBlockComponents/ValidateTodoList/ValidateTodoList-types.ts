import type {
	ComponentDraft,
	HTMLLayoutDraft,
	ListDraft,
	ListItemDraft,
} from "@rangex/core";
import type { TodoListAttrValidators } from "#dom-attrs";
import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateCheckboxParams {
	componentDraft: ComponentDraft;
	htmlLayoutDraft: HTMLLayoutDraft;
	attrValidators: TodoListAttrValidators;
}

export type ValidateCheckboxResult = ValidateComponentResult;

export interface ValidateTodoItemParams {
	componentDraft: ComponentDraft;
	listItemDraft: ListItemDraft;
	attrValidators: TodoListAttrValidators;
}

export type ValidateTodoItemResult = ValidateComponentResult;

export interface ValidateTodoListNodeParams {
	componentDraft: ComponentDraft;
	listDraft: ListDraft;
	attrValidators: TodoListAttrValidators;
}

export type ValidateTodoListNodeResult = ValidateComponentResult;

export interface ValidateTodoListParams extends ValidateComponentParams {
	attrValidators: TodoListAttrValidators;
}

export type ValidateTodoListResult = ValidateComponentResult;

export interface CreateTodoListValidatorParams {}

export type CreateTodoListValidatorResult = ComponentValidator;
