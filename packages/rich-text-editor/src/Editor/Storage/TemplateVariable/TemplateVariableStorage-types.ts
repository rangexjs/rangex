import type { InlineNestedContext } from "rich-text-area";
import type { TemplateVariableKind } from "#adapters";
import type {
	TemplateVariableId,
	TemplateVariableRootId,
} from "../../Constants";
import type { RootStorage } from "../Root";
import type {
	templateVariableKeys,
	templateVariableRootStorageVersion,
	templateVariableStorageVersion,
} from "./TemplateVariableStorage";

type TemplateVariableValue = string | null;

export type TemplateVariableKeys = (typeof templateVariableKeys)[number];

type TemplateVariableValues = {
	[K in TemplateVariableKeys]: TemplateVariableValue;
};

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
	inlineNestedContext: InlineNestedContext;
	fallbacks: TemplateVariableStorageFallbacks;
}

export interface EnsureNodeTemplateVariableStorageResult
	extends TemplateVariableStorage {}

// Shared store on RootEditable — single source of truth for all variable values.
export interface TemplateVariableRootStorage extends TemplateVariableValues {
	id: TemplateVariableRootId;
	version: typeof templateVariableRootStorageVersion;
}

export interface CreateTemplateVariableRootStorageResult
	extends TemplateVariableRootStorage {}

export interface EnsureTemplateVariableRootStorageParams {
	rootStorage: RootStorage;
}

export interface EnsureTemplateVariableRootStorageResult
	extends TemplateVariableRootStorage {}
