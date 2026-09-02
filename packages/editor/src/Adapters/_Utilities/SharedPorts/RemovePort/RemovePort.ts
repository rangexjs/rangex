import type {
	CreateRemovePortResult,
	OnRemoveCallbackFn,
	RemoveConfigPort,
	RemovePublicPort,
} from "./RemovePort-types";

export const createRemovePort = (): CreateRemovePortResult => {
	// ConfigPort
	const onRemoveListeners: Set<OnRemoveCallbackFn> = new Set();

	const configPort: RemoveConfigPort = {
		onRemove(callback) {
			onRemoveListeners.add(callback);
			return () => onRemoveListeners.delete(callback);
		},
	};

	const publicPort: RemovePublicPort = {
		remove() {
			for (const listener of onRemoveListeners) {
				listener();
			}
		},
	};

	return { configPort, publicPort };
};
