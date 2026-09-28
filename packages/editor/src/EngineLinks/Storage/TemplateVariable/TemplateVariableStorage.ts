import { templateVariableId } from "../../Constants";
import { isStorage, storageVersion, validateStorage } from "../_Utilities";
import type {
	CreateTemplateVariableStorageParams,
	CreateTemplateVariableStorageResult,
	EnsureNodeTemplateVariableStorageParams,
	EnsureNodeTemplateVariableStorageResult,
	EnsureTemplateVariableStorageParams,
	EnsureTemplateVariableStorageResult,
	TemplateVariableStorage,
} from "./TemplateVariableStorage-types";

export const isTemplateVariableStorage = (
	storage: unknown,
): storage is TemplateVariableStorage => {
	return isStorage(storage, { id: templateVariableId });
};

export const validateTemplateVariableStorage = (
	storage: unknown,
): storage is TemplateVariableStorage => {
	return validateStorage(storage, isTemplateVariableStorage);
};

export const createTemplateVariableStorage = ({
	fieldName,
}: CreateTemplateVariableStorageParams): CreateTemplateVariableStorageResult => {
	return {
		id: templateVariableId,
		version: storageVersion,
		fieldName,
	};
};

export const ensureTemplateVariableStorage = ({
	storage,
	fallbacks,
}: EnsureTemplateVariableStorageParams): EnsureTemplateVariableStorageResult => {
	if (validateTemplateVariableStorage(storage)) {
		return storage;
	}

	return createTemplateVariableStorage(fallbacks);
};

export const ensureNodeTemplateVariableStorage = ({
	inlineComponent,
	fallbacks,
}: EnsureNodeTemplateVariableStorageParams): EnsureNodeTemplateVariableStorageResult => {
	const { $$customStorage } = inlineComponent;

	const storage = ensureTemplateVariableStorage({
		storage: $$customStorage,
		fallbacks,
	});
	inlineComponent.$$customStorage = storage;

	return storage;
};
