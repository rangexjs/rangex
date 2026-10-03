import { editorSelectionChangeEventType } from "@rangex/core";
import type { HandleSelectionContextChangeParams } from "./HandleSelectionContextChange-types";

/*
 * Runs the callback on every selection change and on every structural change under the
 * RootEditable, since the content can change without the selection moving. Returns a cleanup
 * function.
 */
export const handleSelectionContextChange = ({
	editorAPI,
	onChange,
}: HandleSelectionContextChangeParams) => {
	const { rootEditable } = editorAPI;

	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			onChange();
		},
	});

	const observer = new MutationObserver(() => {
		onChange();
	});

	observer.observe(rootEditable, { childList: true, subtree: true });

	return () => {
		unsubscribe();
		observer.disconnect();
	};
};
