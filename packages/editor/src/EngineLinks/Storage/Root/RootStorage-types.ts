import type { RootEditable } from "rich-text-area";
import type { RootId } from "../../Constants";
import type { rootStorageVersion, templateVariableKeys } from "./RootStorage";

export type TemplateVariableKeys = (typeof templateVariableKeys)[number];

export type TemplateVariableValues = Record<
	TemplateVariableKeys,
	string | null
>;

export interface RootStorage {
	id: RootId;
	version: typeof rootStorageVersion;
	templateVariable: TemplateVariableValues;
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
