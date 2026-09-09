import type { ConfigureReadOnlyParams } from "./ConfigureReadOnly-types";

export const configureReadOnly = ({
	configPort,
	editorAPI,
}: ConfigureReadOnlyParams) => {
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
