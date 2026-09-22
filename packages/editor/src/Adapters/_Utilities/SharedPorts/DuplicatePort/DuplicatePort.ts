import { createEmitter } from "../../CreateEmitter";
import type {
	CreateDuplicatePortResult,
	DuplicateConfigPort,
	DuplicatePublicPort,
	OnDuplicateCallbackFn,
} from "./DuplicatePort-types";

export const createDuplicatePort = (): CreateDuplicatePortResult => {
	// CommandListeners
	const duplicateEmitter = createEmitter<OnDuplicateCallbackFn>();

	const configPort: DuplicateConfigPort = {
		onDuplicate(callback) {
			return duplicateEmitter.subscribe(callback);
		},
	};

	const publicPort: DuplicatePublicPort = {
		duplicate() {
			duplicateEmitter.emit();
		},
	};

	return { configPort, publicPort };
};
