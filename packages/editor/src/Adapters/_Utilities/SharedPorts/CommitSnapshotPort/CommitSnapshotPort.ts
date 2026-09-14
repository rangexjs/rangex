import type {
	CommitSnapshotConfigPort,
	CommitSnapshotPublicPort,
	CreateCommitSnapshotPortResult,
	OnCommitSnapshotCallbackFn,
} from "./CommitSnapshotPort-types";

export const createCommitSnapshotPort = (): CreateCommitSnapshotPortResult => {
	// CommandListeners
	const onCommitSnapshotListeners: Set<OnCommitSnapshotCallbackFn> = new Set();

	const configPort: CommitSnapshotConfigPort = {
		onCommitSnapshot(callback) {
			onCommitSnapshotListeners.add(callback);
			return () => onCommitSnapshotListeners.delete(callback);
		},
	};

	const publicPort: CommitSnapshotPublicPort = {
		commitSnapshot() {
			for (const listener of onCommitSnapshotListeners) {
				listener();
			}
		},
	};

	return { configPort, publicPort };
};
