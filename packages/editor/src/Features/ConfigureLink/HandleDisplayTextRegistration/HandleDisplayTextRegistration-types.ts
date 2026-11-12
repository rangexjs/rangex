import type { EditorAPI, InlineComponent } from "@rangex/core";

import type { LinkConfigPort, LinkDisplayText } from "#adapters/Link";

export interface HandleDisplayTextRegistrationParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
}

export type GetDisplayTextInfoResult = LinkDisplayText;

export interface GetDisplayTextFromLinkParams {
	editorAPI: EditorAPI;
	link: InlineComponent;
}

export interface GetDisplayTextFromSelectionParams {
	editorAPI: EditorAPI;
}
