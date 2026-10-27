import type { BlockComponentLine } from "@rangex/core";
import { blockAlignAttr } from "#constants";
import { getBlockAlign, setBlockAlign } from "../BlockAlign";
import type { HandleBlockAlignStateParams } from "./HandleBlockAlignState-types";

/*
 * Keeps the port's alignment in sync with the current block and applies alignment changes to it,
 * registering a snapshot boundary after each change. The current block's line is observed, so the
 * alignment is updated whenever its attribute changes (e.g. by undo/redo). Returns a cleanup function.
 */
export const handleBlockAlignState = ({
	port,
	editorAPI,
}: HandleBlockAlignStateParams) => {
	let observedLine: BlockComponentLine | null = null;

	const observer = new MutationObserver(() => {
		if (!observedLine) {
			return;
		}

		const align = getBlockAlign({ blockComponentLine: observedLine });

		port.updateBlockAlign({ align });
	});

	const unsubscribeCurrentComponentUpdate = port.onCurrentComponentUpdate(
		(currentComponent) => {
			observer.disconnect();
			observedLine = null;

			if (!currentComponent) {
				return;
			}

			const { $$parentElement } = currentComponent;

			if (!$$parentElement) {
				throw new Error("ParentElement not supposed to be null.");
			}

			const align = getBlockAlign({ blockComponentLine: $$parentElement });

			port.updateBlockAlign({ align });

			observedLine = $$parentElement;

			observer.observe($$parentElement, {
				attributes: true,
				attributeFilter: [blockAlignAttr.name],
			});
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
		observer.disconnect();
	};
};
