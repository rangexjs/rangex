import type {
	ConfigureThemeParams,
	ConfigureViewParams,
} from "./ConfigureView-types";

const configureTheme = ({ richTextEditorUI }: ConfigureThemeParams) => {
	richTextEditorUI.onMenuBar((params) => {
		if (params.type !== "theme") {
			return;
		}

		const { newValue } = params;

		richTextEditorUI.updateMenuBarButtonState({ theme: { value: newValue } });
	});
};

export const configureView = ({
	richTextEditorUI,
	// biome-ignore lint/correctness/noUnusedFunctionParameters: Unused, but keep it for consistency
	editorAPI,
}: ConfigureViewParams) => {
	configureTheme({ richTextEditorUI });
};
