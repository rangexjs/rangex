import type { HandleCaptionStateParams } from "./HandleCaptionState-types";

/*
 * Keeps the port's caption state in sync with the current media block and applies caption toggle
 * and position changes to its figure, registering a snapshot boundary after each change.
 * The figure/caption accessors are injected since their DOM shape varies by media type.
 */
export const handleCaptionState = ({
	port,
	editorAPI,
	getFigure,
	getCaption,
	setCaptionEnabled,
	setCaptionPosition,
}: HandleCaptionStateParams) => {
	const unsubscribeCurrentComponentUpdate = port.onCurrentComponentUpdate((currentComponent) => {
		if (!currentComponent) {
			return;
		}

		const figure = getFigure({ blockComponent: currentComponent });

		port.updateCaption(getCaption({ figure }));
	});

	const unsubscribeCaptionEnabledChange = port.onChangeCaptionEnabled((enabled) => {
		const { currentComponent } = port;

		if (!currentComponent) {
			return;
		}

		const figure = getFigure({ blockComponent: currentComponent });

		setCaptionEnabled({ figure, enabled, position: port.captionPosition });
		port.updateCaption(getCaption({ figure }));

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	const unsubscribeCaptionPositionChange = port.onChangeCaptionPosition((position) => {
		const { currentComponent } = port;

		if (!currentComponent) {
			return;
		}

		const figure = getFigure({ blockComponent: currentComponent });

		setCaptionPosition({ figure, position });
		port.updateCaption(getCaption({ figure }));

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribeCurrentComponentUpdate();
		unsubscribeCaptionEnabledChange();
		unsubscribeCaptionPositionChange();
	};
};
