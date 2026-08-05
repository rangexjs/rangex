import { templateVariableId, templateVariableRootId } from "../../Constants";
import { isStorage, validateStorage } from "../_Utilities";
import type {
	CreateTemplateVariableRootStorageResult,
	CreateTemplateVariableStorageParams,
	CreateTemplateVariableStorageResult,
	EnsureNodeTemplateVariableStorageParams,
	EnsureNodeTemplateVariableStorageResult,
	EnsureTemplateVariableRootStorageParams,
	EnsureTemplateVariableRootStorageResult,
	EnsureTemplateVariableStorageParams,
	EnsureTemplateVariableStorageResult,
	TemplateVariableRootStorage,
	TemplateVariableStorage,
} from "./TemplateVariableStorage-types";

export const templateVariableStorageVersion = 1 as const;
export const templateVariableRootStorageVersion = 1 as const;

export const templateVariableKeys = [
	"firstName",
	"lastName",
	"email",
	"date",
] as const;

export const isTemplateVariableStorage = (
	storage: unknown,
): storage is TemplateVariableStorage => {
	return isStorage(storage, {
		id: templateVariableId,
		version: templateVariableStorageVersion,
	});
};

export const validateTemplateVariableStorage = (
	storage: unknown,
): storage is TemplateVariableStorage => {
	return validateStorage(storage, isTemplateVariableStorage);
};

export const createTemplateVariableStorage = ({
	type,
}: CreateTemplateVariableStorageParams): CreateTemplateVariableStorageResult => {
	return {
		id: templateVariableId,
		version: templateVariableStorageVersion,
		type,
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

export const isTemplateVariableRootStorage = (
	storage: unknown,
): storage is TemplateVariableRootStorage => {
	return isStorage(storage, {
		id: templateVariableRootId,
		version: templateVariableRootStorageVersion,
	});
};

export const validateTemplateVariableRootStorage = (
	storage: unknown,
): storage is TemplateVariableRootStorage => {
	return validateStorage(storage, isTemplateVariableRootStorage);
};

export const createTemplateVariableRootStorage =
	(): CreateTemplateVariableRootStorageResult => ({
		id: templateVariableRootId,
		version: templateVariableRootStorageVersion,
		firstName: null,
		lastName: null,
		email: null,
		date: null,
	});

export const ensureTemplateVariableRootStorage = ({
	rootStorage,
}: EnsureTemplateVariableRootStorageParams): EnsureTemplateVariableRootStorageResult => {
	const { templateVariable } = rootStorage;

	if (validateTemplateVariableRootStorage(templateVariable)) {
		return templateVariable;
	}

	const storage = createTemplateVariableRootStorage();
	// RootStorage.templateVariable is loosely typed so RootStorage stays feature-agnostic.
	rootStorage.templateVariable = storage as unknown as Record<string, unknown>;

	return storage;
};
