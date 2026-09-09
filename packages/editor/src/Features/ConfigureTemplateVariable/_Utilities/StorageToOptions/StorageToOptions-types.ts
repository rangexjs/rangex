import type { Options } from "#adapters/TemplateVariable";
import type { TemplateVariableValues } from "#engine-links";

export interface StorageToOptionsParams {
	storage: TemplateVariableValues;
}

export interface StorageToOptionsResult extends Options {}
