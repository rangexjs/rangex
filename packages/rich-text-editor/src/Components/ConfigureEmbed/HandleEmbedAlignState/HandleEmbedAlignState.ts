import { setBlockAlign } from "../../_Utilities";
import type { HandleEmbedAlignStateParams } from "./HandleEmbedAlignState-types";

/**
 * Wires the popover's alignment control to the engine. Reads the active embed from the shared
 * {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a new block.
 */
export const handleEmbedAlignState = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleEmbedAlignStateParams) => {
	const { embedPopover } = richTextEditorUI;

	const unsubscribeAlignChange = embedPopover.onAlignChange((align) => {
		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const { $$parentElement } = currentBlock;

		if (!$$parentElement) {
			throw new Error("ParentElement not supposed to be null.");
		}

		setBlockAlign({ blockNestedContextLine: $$parentElement, align });
		embedPopover.updateState({ align });

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribeAlignChange();
	};
};
