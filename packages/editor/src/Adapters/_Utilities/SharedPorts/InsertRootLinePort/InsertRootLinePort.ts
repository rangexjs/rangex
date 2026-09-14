import type {
	CreateInsertRootLinePortResult,
	InsertRootLineConfigPort,
	InsertRootLinePublicPort,
	OnInsertRootLineCallbackFn,
} from "./InsertRootLinePort-types";

export const createInsertRootLinePort = (): CreateInsertRootLinePortResult => {
	// CommandListeners
	const onInsertRootLineListeners: Set<OnInsertRootLineCallbackFn> = new Set();

	const configPort: InsertRootLineConfigPort = {
		onInsertRootLine(callback) {
			onInsertRootLineListeners.add(callback);
			return () => onInsertRootLineListeners.delete(callback);
		},
	};

	const publicPort: InsertRootLinePublicPort = {
		insertRootLine(position) {
			for (const listener of onInsertRootLineListeners) {
				listener(position);
			}
		},
	};

	return { configPort, publicPort };
};
