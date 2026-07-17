import type { TemplateVariableOptions } from "#ui";
import type { TemplateVariableRootStorage } from "../../TemplateVariableStorage";

export interface StorageToOptionsParams {
	storage: TemplateVariableRootStorage;
}

export interface StorageToOptionsResult extends TemplateVariableOptions {}
