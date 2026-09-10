import type { EditorAPI, InlineComponent } from "rich-text-area";
import type {
	LinkDisplayText,
	LinkToggleButtons,
	LinkURL,
} from "#adapters/Link";

export interface GetStateFromLinkParams {
	editorAPI: EditorAPI;
	link: InlineComponent;
}

export interface GetStateFromLinkResult {
	displayText: LinkDisplayText;
	url: LinkURL;
	toggleButtons: LinkToggleButtons;
}
