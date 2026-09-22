import { createEmitter } from "../../CreateEmitter";
import type {
	CreateUnwrapPortResult,
	OnUnwrapCallbackFn,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "./UnwrapPort-types";

export const createUnwrapPort = (): CreateUnwrapPortResult => {
	// CommandListeners
	const unwrapEmitter = createEmitter<OnUnwrapCallbackFn>();

	const configPort: UnwrapConfigPort = {
		onUnwrap(callback) {
			return unwrapEmitter.subscribe(callback);
		},
	};

	const publicPort: UnwrapPublicPort = {
		unwrap() {
			unwrapEmitter.emit();
		},
	};

	return { configPort, publicPort };
};
