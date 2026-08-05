import type { TemplateVariableOptions } from "#adapters";
import type { TemplateVariableValues } from "../../../../Storage";

export interface StorageToOptionsParams {
	storage: TemplateVariableValues;
}

export interface StorageToOptionsResult extends TemplateVariableOptions {}
