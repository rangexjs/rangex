import { setBlockAlign } from "../../_Utilities";
import type { HandleAudioAlignStateParams } from "./HandleAudioAlignState-types";

/**
 * Wires the popover's alignment control to the engine. Reads the active audio from the shared
 * {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a new block.
 */
export const handleAudioAlignState = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleAudioAlignStateParams) => {
	const { audioEditPopover } = richTextEditorUI;

	const unsubscribeAlignChange = audioEditPopover.onAlignChange((align) => {
		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const { $$parentElement } = currentBlock;

		if (!$$parentElement) {
			throw new Error("ParentElement not supposed to be null.");
		}

		setBlockAlign({ blockNestedContextLine: $$parentElement, align });
		audioEditPopover.updateState({ align });

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribeAlignChange();
	};
};
