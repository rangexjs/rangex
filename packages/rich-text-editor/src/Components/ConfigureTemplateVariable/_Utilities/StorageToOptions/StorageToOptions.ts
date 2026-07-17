import type {
	StorageToOptionsParams,
	StorageToOptionsResult,
} from "./StorageToOptions-types";

export const storageToOptions = ({
	storage,
}: StorageToOptionsParams): StorageToOptionsResult => {
	const { firstName, lastName, email, date } = storage;

	return { firstName, lastName, email, date };
};
