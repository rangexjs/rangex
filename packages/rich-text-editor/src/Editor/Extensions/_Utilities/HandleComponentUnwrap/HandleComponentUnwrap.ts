import type { HandleComponentUnwrapParams } from "./HandleComponentUnwrap-types";

/**
 * Wires an `UnwrapPort`'s `onUnwrap` to whatever `NestedContext` `getComponent` currently
 * resolves to, calling `$$unwrap` on it. Works for both `InlineNestedContext` and
 * `BlockNestedContext` since `$$unwrap` is defined on `NestedContext` itself.
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
