import type {
	CreateUnwrapPortResult,
	OnUnwrapCallbackFn,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "./UnwrapPort-types";

export const createUnwrapPort = (): CreateUnwrapPortResult => {
	// CommandListeners
	const onUnwrapListeners: Set<OnUnwrapCallbackFn> = new Set();

	const configPort: UnwrapConfigPort = {
		onUnwrap(callback) {
			onUnwrapListeners.add(callback);
			return () => onUnwrapListeners.delete(callback);
		},
	};

	const publicPort: UnwrapPublicPort = {
		unwrap() {
			for (const listener of onUnwrapListeners) {
				listener();
			}
		},
	};

	return { configPort, publicPort };
};
