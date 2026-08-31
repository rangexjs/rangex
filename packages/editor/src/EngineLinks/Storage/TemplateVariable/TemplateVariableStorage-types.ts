import type { InlineComponent } from "rich-text-area";
import type { TemplateVariableKind } from "#adapters";
import type { TemplateVariableId } from "../../Constants";
import type { templateVariableStorageVersion } from "./TemplateVariableStorage";

export interface TemplateVariableStorage {
	id: TemplateVariableId;
	version: typeof templateVariableStorageVersion;
	type: TemplateVariableKind;
}

export interface CreateTemplateVariableStorageParams {
	type: TemplateVariableKind;
}

export interface CreateTemplateVariableStorageResult
	extends TemplateVariableStorage {}

export interface TemplateVariableStorageFallbacks {
	type: TemplateVariableKind;
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
