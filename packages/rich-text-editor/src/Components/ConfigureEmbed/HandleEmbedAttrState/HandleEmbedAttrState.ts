import {
	getEmbedFigure,
	getEmbedIframe,
	setEmbedAspectRatio,
	setEmbedTitle,
} from "../_Utilities";
import type { HandleEmbedAttrStateParams } from "./HandleEmbedAttrState-types";

/**
 * Wires the popover's embed attribute controls to the engine. Reads the active embed from
 * the shared {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a
 * new block.
 */
export const handleEmbedAttrState = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleEmbedAttrStateParams) => {
	const { embedEditPopover } = richTextEditorUI;

	const unsubscribeEmbedAttrChange = embedEditPopover.onEmbedAttrChange(
		({ aspectRatio, title }) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getEmbedFigure({ blockNestedContext: currentBlock });
			const iframe = getEmbedIframe({ figure });

			if (aspectRatio !== undefined) {
				setEmbedAspectRatio({ iframe, aspectRatio });
			}

			if (title !== undefined) {
				setEmbedTitle({ iframe, title });
			}

			embedEditPopover.updateState({ aspectRatio, title });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	return () => {
		unsubscribeEmbedAttrChange();
	};
};
