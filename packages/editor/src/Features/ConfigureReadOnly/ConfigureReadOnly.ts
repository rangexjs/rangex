import type { ConfigureReadOnlyParams } from "./ConfigureReadOnly-types";

/*
 * Syncs the read-only toggle's initial state with the editor's editability and wires up toggling
 * it, returning a cleanup function.
 */
export const configureReadOnly = ({ configPort, editorAPI }: ConfigureReadOnlyParams) => {
	configPort.updateState({ checked: !editorAPI.getIsTextAreaEditable() });

	const unsubscribe = configPort.onToggle((checked) => {
		const nextChecked = !checked;

		editorAPI.setIsTextAreaEditable(!nextChecked);
		configPort.updateState({ checked: nextChecked });
	});

	return () => {
		unsubscribe();
	};
};
