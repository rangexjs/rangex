import type { HandleLinkViewChangeParams } from "./HandleLinkViewChange-types";

/**
 * `editorPort` is the only writer of `view` state — the UI only ever emits the view it wants, never sets it directly.
 */
export const handleLinkViewChange = ({
	editorPort,
}: HandleLinkViewChangeParams) => {
	const unsubscribe = editorPort.onViewChange((view) => {
		editorPort.updateState({ view });
	});

	return () => {
		unsubscribe();
	};
};
