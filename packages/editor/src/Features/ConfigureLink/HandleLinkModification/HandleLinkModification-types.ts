import type { EditorAPI } from "rich-text-area";
import type { ApplyParams, LinkConfigPort } from "#adapters/Link";
import type { LinkInternals } from "../ConfigureLink-types";

export interface HandleLinkModificationParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}

export type OnModifyCallback = (params: ApplyParams) => void;
