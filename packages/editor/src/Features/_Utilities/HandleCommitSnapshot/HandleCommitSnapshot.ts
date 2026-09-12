import type { HandleCommitSnapshotParams } from "./HandleCommitSnapshot-types";

/*
 * Registers a snapshot boundary whenever the port signals that a direct DOM mutation
 * happened outside the normal port-driven change flow.
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
