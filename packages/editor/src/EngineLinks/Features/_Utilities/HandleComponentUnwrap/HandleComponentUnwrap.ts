import type { HandleComponentUnwrapParams } from "./HandleComponentUnwrap-types";

/**
 * Wires an `UnwrapConfigPort`'s `onUnwrap` to whatever `Component` `getComponent` currently
 * resolves to, calling `$$unwrap` on it. Works for both `InlineComponent` and
 * `BlockComponent` since `$$unwrap` is defined on `Component` itself.
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
