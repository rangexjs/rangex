import {
	getEmbedCaption,
	getEmbedFigure,
	setEmbedCaptionEnabled,
	setEmbedCaptionPosition,
} from "../_Utilities";
import type { HandleEmbedCaptionStateParams } from "./HandleEmbedCaptionState-types";

/**
 * Wires the popover's caption toggle and position controls to the engine. Reads the
 * active embed from the shared {@link BlockPopoverAppearanceHandler} — set whenever the
 * popover opens over a new block.
 */
export const handleEmbedCaptionState = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleEmbedCaptionStateParams) => {
	const { embedPopover } = richTextEditorUI;

	const unsubscribeCaptionEnabledChange = embedPopover.onCaptionEnabledChange(
		(enabled) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getEmbedFigure({ blockNestedContext: currentBlock });

			setEmbedCaptionEnabled({ figure, enabled });
			embedPopover.updateState({ caption: getEmbedCaption({ figure }) });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	const unsubscribeCaptionPositionChange = embedPopover.onCaptionPositionChange(
		(position) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getEmbedFigure({ blockNestedContext: currentBlock });

			setEmbedCaptionPosition({ figure, position });
			embedPopover.updateState({ caption: getEmbedCaption({ figure }) });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	return () => {
		unsubscribeCaptionEnabledChange();
		unsubscribeCaptionPositionChange();
	};
};
