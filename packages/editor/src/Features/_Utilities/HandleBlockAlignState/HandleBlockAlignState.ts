import { getBlockAlign, setBlockAlign } from "../BlockAlign";
import type { HandleBlockAlignStateParams } from "./HandleBlockAlignState-types";

/*
 * Keeps the port's alignment in sync with the current block and applies alignment changes to it,
 * registering a snapshot boundary after each change. Returns a cleanup function.
 */
export const handleBlockAlignState = ({
	port,
	editorAPI,
}: HandleBlockAlignStateParams) => {
	const unsubscribeCurrentComponentUpdate = port.onCurrentComponentUpdate(
		(currentComponent) => {
			if (!currentComponent) {
				return;
			}

			const { $$parentElement } = currentComponent;

			if (!$$parentElement) {
				throw new Error("ParentElement not supposed to be null.");
			}

			const align = getBlockAlign({ blockComponentLine: $$parentElement });

			port.updateBlockAlign({ align });
		},
	);

	const unsubscribeAlignChange = port.onChangeAlign((align) => {
		const { currentComponent } = port;

		if (!currentComponent) {
			return;
		}

		const { $$parentElement } = currentComponent;

		if (!$$parentElement) {
			throw new Error("ParentElement not supposed to be null.");
		}

		setBlockAlign({ blockComponentLine: $$parentElement, align });
		port.updateBlockAlign({ align });

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribeCurrentComponentUpdate();
		unsubscribeAlignChange();
	};
};
