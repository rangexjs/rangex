import type { RootEditable } from "@rangex/core";
import type { TemplateVariableFields } from "#adapters/TemplateVariable";
import type { RootId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export interface RootStorage {
	id: RootId;
	version: typeof storageVersion;
	templateVariable: TemplateVariableFields;
}

export interface CreateRootStorageResult extends RootStorage {}

export interface EnsureRootStorageParams {
	storage: unknown;
}

export interface EnsureRootStorageResult extends RootStorage {}

export interface EnsureNodeRootStorageParams {
	rootEditable: RootEditable;
}

export interface EnsureNodeRootStorageResult extends RootStorage {}
