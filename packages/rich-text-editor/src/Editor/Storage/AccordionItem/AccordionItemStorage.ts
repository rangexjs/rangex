import { accordionItemId } from "../../Constants";
import type {
	AccordionItemStorage,
	CreateAccordionItemStorageResult,
	EnsureAccordionItemStorageParams,
	EnsureAccordionItemStorageResult,
	EnsureNodeAccordionItemStorageParams,
	EnsureNodeAccordionItemStorageResult,
} from "./AccordionItemStorage-types";

export const accordionItemStorageVersion = 1 as const;

export const isAccordionItemStorage = (
	storage: unknown,
): storage is AccordionItemStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === accordionItemId &&
	"version" in storage &&
	storage.version === accordionItemStorageVersion;

export const validateAccordionItemStorage = (
	storage: unknown,
): storage is AccordionItemStorage => {
	const isValid = isAccordionItemStorage(storage);

	if (!isValid) {
		console.warn(
			"validateAccordionItemStorage: unexpected data shape",
			storage,
		);
	}

	return isValid;
};

export const createAccordionItemStorage =
	(): CreateAccordionItemStorageResult => ({
		id: accordionItemId,
		version: accordionItemStorageVersion,
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
