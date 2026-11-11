import type { TemplateVariableId } from "../_Constants";

export type TemplateVariableStorage = {
	id: TemplateVariableId;
	fieldName: string;
};

export interface CreateTemplateVariableStorageParams {
	fieldName: string;
}

export type CreateTemplateVariableStorageResult = TemplateVariableStorage;
