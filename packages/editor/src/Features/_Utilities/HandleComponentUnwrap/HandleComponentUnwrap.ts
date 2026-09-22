import type { HandleComponentUnwrapParams } from "./HandleComponentUnwrap-types";

/*
 * Wires an unwrap control to the engine, unwrapping the currently resolved component and
 * registering a snapshot boundary.
 */
export const handleComponentUnwrap = ({
	port,
	editorAPI,
	getComponent,
}: HandleComponentUnwrapParams) => {
	const unsubscribe = port.onUnwrap(() => {
		const component = getComponent();

		if (!component) {
			console.warn("Component wasn't assigned.");
			return;
		}

		component.$$unwrap();

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
