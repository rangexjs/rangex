import type { RootEditable } from "@rangex/core";
import type { TemplateVariableFields } from "#adapters/TemplateVariable";
import type { RootType } from "#constants";
import type { RootId } from "../_Constants";
import type { snapshotVersion } from "./RootStorage";

export type RootStorage = {
	id: RootId;
	version: typeof snapshotVersion;
	type: RootType;
	templateVariable: TemplateVariableFields;
};

export interface CreateRootStorageParams {
	type: RootType;
}

export type CreateRootStorageResult = RootStorage;

export interface EnsureRootStorageParams {
	storage: unknown;
}

export type EnsureRootStorageResult = RootStorage;

export interface EnsureNodeRootStorageParams {
	rootEditable: RootEditable;
}

export type EnsureNodeRootStorageResult = RootStorage;
