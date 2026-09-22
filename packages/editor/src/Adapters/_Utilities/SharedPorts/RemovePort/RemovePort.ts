import { createEmitter } from "../../CreateEmitter";
import type {
	CreateRemovePortResult,
	OnRemoveCallbackFn,
	RemoveConfigPort,
	RemovePublicPort,
} from "./RemovePort-types";

export const createRemovePort = (): CreateRemovePortResult => {
	// CommandListeners
	const removeEmitter = createEmitter<OnRemoveCallbackFn>();

	const configPort: RemoveConfigPort = {
		onRemove(callback) {
			return removeEmitter.subscribe(callback);
		},
	};

	const publicPort: RemovePublicPort = {
		remove() {
			removeEmitter.emit();
		},
	};

	return { configPort, publicPort };
};
