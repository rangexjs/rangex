import { type JSONPattern, matchJSON } from "#utilities";
import { accordionItemId } from "../_Constants";
import { validateStorage } from "../_Utilities";
import type {
	AccordionItemStorage,
	CreateAccordionItemStorageResult,
	EnsureAccordionItemStorageParams,
	EnsureAccordionItemStorageResult,
	EnsureNodeAccordionItemStorageParams,
	EnsureNodeAccordionItemStorageResult,
} from "./AccordionItemStorage-types";

/*
 * The AccordionItem's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const accordionItemStoragePattern = {
	id: accordionItemId,
} satisfies JSONPattern<AccordionItemStorage>;

/*
 * Matches a value against accordionItemStoragePattern, returning the first mismatch or null.
 */
export const matchAccordionItemStorage = (storage: unknown) => {
	return matchJSON({ value: storage, pattern: accordionItemStoragePattern });
};

export const isAccordionItemStorage = (
	storage: unknown,
): storage is AccordionItemStorage => {
	const mismatch = matchAccordionItemStorage(storage);

	return !mismatch;
};

export const validateAccordionItemStorage = (
	storage: unknown,
): storage is AccordionItemStorage => {
	return validateStorage(storage, isAccordionItemStorage);
};

export const createAccordionItemStorage =
	(): CreateAccordionItemStorageResult => ({
		id: accordionItemId,
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
