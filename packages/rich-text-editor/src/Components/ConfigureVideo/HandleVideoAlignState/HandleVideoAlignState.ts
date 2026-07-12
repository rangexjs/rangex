import { componentsName } from "../../../Constants";
import { setBlockAlign } from "../../_Utilities";
import type { HandleVideoAlignStateParams } from "./HandleVideoAlignState-types";

/**
 * Wires the popover's alignment control to the engine. Reads the active video from the shared
 * {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a new block.
 */
export const handleVideoAlignState = ({
	richTextEditorUI,
	editorAPI,
	blockPopoverAppearanceHandler,
}: HandleVideoAlignStateParams) => {
	const { videoPopover } = richTextEditorUI;

	const unsubscribeAlignChange = videoPopover.onAlignChange((align) => {
		const currentBlock = blockPopoverAppearanceHandler.getCurrentBlock({
			componentName: componentsName.video,
		});

		if (!currentBlock) {
			return;
		}

		const { $$parentElement } = currentBlock;

		if (!$$parentElement) {
			throw new Error("ParentElement not supposed to be null.");
		}

		setBlockAlign({ blockNestedContextLine: $$parentElement, align });
		videoPopover.updateState({ align });

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribeAlignChange();
	};
};
