import { editorSelectionChangeEventType } from "rich-text-area";
import type { HandleComponentPlacementStateParams } from "./HandleComponentPlacementState-types";

/*
 * Runs the given update on every selection change and on every structural change under the
 * RootEditable, since the content can change without the selection moving. Returns a cleanup
 * function.
 */
export const handleComponentPlacementState = ({
	editorAPI,
	updateState,
}: HandleComponentPlacementStateParams) => {
	const { rootEditable } = editorAPI;

	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			updateState();
		},
	});

	const observer = new MutationObserver(() => {
		updateState();
	});

	observer.observe(rootEditable, { childList: true, subtree: true });

	return () => {
		unsubscribe();
		observer.disconnect();
	};
};
