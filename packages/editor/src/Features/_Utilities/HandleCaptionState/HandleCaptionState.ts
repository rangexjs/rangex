import type { HandleCaptionStateParams } from "./HandleCaptionState-types";

/*
 * Wires a popover's caption toggle and position controls to the engine, applying changes to
 * the active media block's figure and registering a snapshot boundary after each change.
 * The figure/caption accessors are injected since their DOM shape varies by media type.
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
	const unsubscribeCaptionEnabledChange = port.onChangeCaptionEnabled(
		(enabled) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getFigure({ blockComponent: currentBlock });

			setCaptionEnabled({ figure, enabled, position: port.captionPosition });
			port.updateCaption(getCaption({ figure }));

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	const unsubscribeCaptionPositionChange = port.onChangeCaptionPosition(
		(position) => {
			const currentBlock = getCurrentBlock();

			if (!currentBlock) {
				return;
			}

			const figure = getFigure({ blockComponent: currentBlock });

			setCaptionPosition({ figure, position });
			port.updateCaption(getCaption({ figure }));

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		},
	);

	return () => {
		unsubscribeCaptionEnabledChange();
		unsubscribeCaptionPositionChange();
	};
};
