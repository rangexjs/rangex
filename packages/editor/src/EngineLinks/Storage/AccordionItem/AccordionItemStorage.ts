import { accordionItemId } from "../../Constants";
import { isStorage, storageVersion, validateStorage } from "../_Utilities";
import type {
	AccordionItemStorage,
	CreateAccordionItemStorageResult,
	EnsureAccordionItemStorageParams,
	EnsureAccordionItemStorageResult,
	EnsureNodeAccordionItemStorageParams,
	EnsureNodeAccordionItemStorageResult,
} from "./AccordionItemStorage-types";

export const isAccordionItemStorage = (
	storage: unknown,
): storage is AccordionItemStorage => {
	return isStorage(storage, { id: accordionItemId });
};

export const validateAccordionItemStorage = (
	storage: unknown,
): storage is AccordionItemStorage => {
	return validateStorage(storage, isAccordionItemStorage);
};

export const createAccordionItemStorage =
	(): CreateAccordionItemStorageResult => ({
		id: accordionItemId,
		version: storageVersion,
	});

export const ensureAccordionItemStorage = ({
	storage,
}: EnsureAccordionItemStorageParams): EnsureAccordionItemStorageResult => {
	if (validateAccordionItemStorage(storage)) {
		return storage;
	}

	return createAccordionItemStorage();
};

export const ensureNodeAccordionItemStorage = ({
	blockComponent,
}: EnsureNodeAccordionItemStorageParams): EnsureNodeAccordionItemStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureAccordionItemStorage({ storage: $$customStorage });
	blockComponent.$$customStorage = storage;

	return storage;
};
