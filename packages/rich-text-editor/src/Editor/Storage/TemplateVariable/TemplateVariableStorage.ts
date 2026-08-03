import { templateVariableId, templateVariableRootId } from "../../Constants";
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
): storage is TemplateVariableStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === templateVariableId &&
	"version" in storage &&
	storage.version === templateVariableStorageVersion;

export const validateTemplateVariableStorage = (
	storage: unknown,
): storage is TemplateVariableStorage => {
	const isValid = isTemplateVariableStorage(storage);

	if (!isValid) {
		console.warn(
			"validateTemplateVariableStorage: unexpected data shape",
			storage,
		);
	}

	return isValid;
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
): storage is TemplateVariableRootStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === templateVariableRootId &&
	"version" in storage &&
	storage.version === templateVariableRootStorageVersion;

export const validateTemplateVariableRootStorage = (
	storage: unknown,
): storage is TemplateVariableRootStorage => {
	const isValid = isTemplateVariableRootStorage(storage);

	if (!isValid) {
		console.warn(
			"validateTemplateVariableRootStorage: unexpected data shape",
			storage,
		);
	}

	return isValid;
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
