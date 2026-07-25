import type { TemplateVariableOptions } from "#adapters";
import type { TemplateVariableRootStorage } from "../../../../Storage";

export interface StorageToOptionsParams {
	storage: TemplateVariableRootStorage;
}

export interface StorageToOptionsResult extends TemplateVariableOptions {}
