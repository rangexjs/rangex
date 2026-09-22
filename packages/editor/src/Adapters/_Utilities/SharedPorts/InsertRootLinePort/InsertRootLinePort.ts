import { createEmitter } from "../../CreateEmitter";
import type {
	CreateInsertRootLinePortResult,
	InsertRootLineConfigPort,
	InsertRootLinePublicPort,
	OnInsertRootLineCallbackFn,
} from "./InsertRootLinePort-types";

export const createInsertRootLinePort = (): CreateInsertRootLinePortResult => {
	// CommandListeners
	const insertRootLineEmitter = createEmitter<OnInsertRootLineCallbackFn>();

	const configPort: InsertRootLineConfigPort = {
		onInsertRootLine(callback) {
			return insertRootLineEmitter.subscribe(callback);
		},
	};

	const publicPort: InsertRootLinePublicPort = {
		insertRootLine(position) {
			insertRootLineEmitter.emit(position);
		},
	};

	return { configPort, publicPort };
};
