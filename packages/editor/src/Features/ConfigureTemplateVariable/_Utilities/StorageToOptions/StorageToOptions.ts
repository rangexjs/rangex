import type {
	StorageToOptionsParams,
	StorageToOptionsResult,
} from "./StorageToOptions-types";

/*
 * Maps the stored template variable values to the adapter's Options shape.
 */
export const storageToOptions = ({
	storage,
}: StorageToOptionsParams): StorageToOptionsResult => {
	const { firstName, lastName, email, date } = storage;

	return { firstName, lastName, email, date };
};
