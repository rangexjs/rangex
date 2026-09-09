import type { HandleCommitSnapshotParams } from "./HandleCommitSnapshot-types";

/**
 * Wires a `CommitSnapshotConfigPort`'s `onCommitSnapshot` to a snapshot boundary — used by
 * consumers that mutate a block's DOM directly (e.g. an `img`'s `object-fit`/`aspect-ratio`/
 * `alt`) without ever routing the value itself through a port, so the engine still needs an
 * explicit signal that a snapshot-worthy change happened.
 */
export const handleCommitSnapshot = ({
	port,
	editorAPI,
}: HandleCommitSnapshotParams) => {
	const unsubscribe = port.onCommitSnapshot(() => {
		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribe();
	};
};
