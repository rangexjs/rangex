import type { InlineComponent } from "rich-text-area";
import type { TemplateVariableId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export interface TemplateVariableStorage {
	id: TemplateVariableId;
	version: typeof storageVersion;
	fieldName: string;
}

export interface CreateTemplateVariableStorageParams {
	fieldName: string;
}

export interface CreateTemplateVariableStorageResult
	extends TemplateVariableStorage {}

export interface TemplateVariableStorageFallbacks {
	fieldName: string;
}

export interface EnsureTemplateVariableStorageParams {
	storage: unknown;
	fallbacks: TemplateVariableStorageFallbacks;
}

export interface EnsureTemplateVariableStorageResult
	extends TemplateVariableStorage {}

export interface EnsureNodeTemplateVariableStorageParams {
	inlineComponent: InlineComponent;
	fallbacks: TemplateVariableStorageFallbacks;
}

export interface EnsureNodeTemplateVariableStorageResult
	extends TemplateVariableStorage {}
