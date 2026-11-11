import type { EditorAPI } from "@rangex/core";

import type { ChangeDisplayTextParams, LinkConfigPort } from "#adapters/Link";

export interface HandleDisplayTextChangeParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
}

export type OnChangeDisplayTextCallback = (params: ChangeDisplayTextParams) => void;
