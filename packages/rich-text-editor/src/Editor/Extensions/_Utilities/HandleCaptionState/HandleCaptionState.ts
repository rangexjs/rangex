import type { HandleCaptionStateParams } from "./HandleCaptionState-types";

/**
 * Wires a popover's caption toggle and position controls to the engine. Reads the active
 * media block from the appearance handler that registered it — set whenever the popover
 * opens over a new block. `getFigure`/`getCaption`/`setCaptionEnabled`/`setCaptionPosition`
 * are injected per media type, since the DOM shape used to locate a caption differs across
 * image/video/audio/embed.
 */
export const handleCaptionState = ({
	port,
	editorAPI,
	getCurrentBlock,
	getFigure,
	getCaption,
	setCaptionEnabled,
	setCaptionPosition,
}: HandleCaptionStateParams) => {
	const unsubscribeCaptionEnabledChange = port.onCaptionEnabledChange(
		(enabled) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getFigure({ blockComponent: currentBlock });

			setCaptionEnabled({ figure, enabled });
			port.setCaption(getCaption({ figure }));

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	const unsubscribeCaptionPositionChange = port.onCaptionPositionChange(
		(position) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getFigure({ blockComponent: currentBlock });

			setCaptionPosition({ figure, position });
			port.setCaption(getCaption({ figure }));

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	return () => {
		unsubscribeCaptionEnabledChange();
		unsubscribeCaptionPositionChange();
	};
};
