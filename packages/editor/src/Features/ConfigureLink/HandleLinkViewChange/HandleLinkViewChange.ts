import type { HandleLinkViewChangeParams } from "./HandleLinkViewChange-types";

/**
 * `configPort` is the only writer of `view` state — the UI only ever emits the view it wants,
 * never sets it directly.
 */
export const handleLinkViewChange = ({
	configPort,
}: HandleLinkViewChangeParams) => {
	const unsubscribe = configPort.onViewChange((view) => {
		configPort.updateState({ view });
	});

	return () => {
		unsubscribe();
	};
};
