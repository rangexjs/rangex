import type { TemplateVariableOptions } from "#adapters";
import type { TemplateVariableRootStorage } from "../../TemplateVariableStorage";

export interface StorageToOptionsParams {
	storage: TemplateVariableRootStorage;
}

export interface StorageToOptionsResult extends TemplateVariableOptions {}
