import type { RootEditable } from "@rangex/core";
import type { TemplateVariableFields } from "#adapters/TemplateVariable";
import type { RootId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export type RootStorage = {
	id: RootId;
	version: typeof storageVersion;
	templateVariable: TemplateVariableFields;
};

export type CreateRootStorageResult = RootStorage;

export interface EnsureRootStorageParams {
	storage: unknown;
}

export type EnsureRootStorageResult = RootStorage;

export interface EnsureNodeRootStorageParams {
	rootEditable: RootEditable;
}

export type EnsureNodeRootStorageResult = RootStorage;
