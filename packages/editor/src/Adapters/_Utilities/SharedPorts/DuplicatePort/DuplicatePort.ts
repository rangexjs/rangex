import type {
	CreateDuplicatePortResult,
	DuplicateConfigPort,
	DuplicatePublicPort,
	OnDuplicateCallbackFn,
} from "./DuplicatePort-types";

export const createDuplicatePort = (): CreateDuplicatePortResult => {
	// CommandListeners
	const onDuplicateListeners: Set<OnDuplicateCallbackFn> = new Set();

	const configPort: DuplicateConfigPort = {
		onDuplicate(callback) {
			onDuplicateListeners.add(callback);
			return () => onDuplicateListeners.delete(callback);
		},
	};

	const publicPort: DuplicatePublicPort = {
		duplicate() {
			for (const listener of onDuplicateListeners) {
				listener();
			}
		},
	};

	return { configPort, publicPort };
};
