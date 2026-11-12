import type { EditorAPI } from "@rangex/core";

import type { TableConfigPort } from "#adapters/Table";

export interface HandleTableContextMenuButtonsStateParams {
	configPort: TableConfigPort;
	editorAPI: EditorAPI;
}
