import type { InlineComponent } from "@rangex/core";
import type { TemplateVariableId } from "../_Constants";

export type TemplateVariableStorage = {
	id: TemplateVariableId;
	fieldName: string;
};

export interface CreateTemplateVariableStorageParams {
	fieldName: string;
}

export type CreateTemplateVariableStorageResult = TemplateVariableStorage;

export interface TemplateVariableStorageFallbacks {
	fieldName: string;
}

export interface EnsureTemplateVariableStorageParams {
	storage: unknown;
	fallbacks: TemplateVariableStorageFallbacks;
}

export type EnsureTemplateVariableStorageResult = TemplateVariableStorage;

export interface EnsureNodeTemplateVariableStorageParams {
	inlineComponent: InlineComponent;
	fallbacks: TemplateVariableStorageFallbacks;
}

export type EnsureNodeTemplateVariableStorageResult = TemplateVariableStorage;
