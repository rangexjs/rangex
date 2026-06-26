import type { TemplateVariableOptions } from "@rangex/rich-text-editor-ui";
import type { TemplateVariableStore } from "../../TemplateVariableStorage";

export interface StorageToOptionsParams {
	storage: TemplateVariableStore;
}

export interface StorageToOptionsResult extends TemplateVariableOptions {}
