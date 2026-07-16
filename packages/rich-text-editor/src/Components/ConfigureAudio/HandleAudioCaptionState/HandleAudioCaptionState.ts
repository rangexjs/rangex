import {
	getAudioCaption,
	getAudioFigure,
	setAudioCaptionEnabled,
	setAudioCaptionPosition,
} from "../_Utilities";
import type { HandleAudioCaptionStateParams } from "./HandleAudioCaptionState-types";

/**
 * Wires the popover's caption toggle and position controls to the engine. Reads the
 * active audio from the shared {@link BlockPopoverAppearanceHandler} — set whenever the
 * popover opens over a new block.
 */
export const handleAudioCaptionState = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleAudioCaptionStateParams) => {
	const { audioEditPopover } = richTextEditorUI;

	const unsubscribeCaptionEnabledChange =
		audioEditPopover.onCaptionEnabledChange((enabled) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getAudioFigure({ blockNestedContext: currentBlock });

			setAudioCaptionEnabled({ figure, enabled });
			audioEditPopover.updateState({ caption: getAudioCaption({ figure }) });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		});

	const unsubscribeCaptionPositionChange =
		audioEditPopover.onCaptionPositionChange((position) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getAudioFigure({ blockNestedContext: currentBlock });

			setAudioCaptionPosition({ figure, position });
			audioEditPopover.updateState({ caption: getAudioCaption({ figure }) });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		});

	return () => {
		unsubscribeCaptionEnabledChange();
		unsubscribeCaptionPositionChange();
	};
};
