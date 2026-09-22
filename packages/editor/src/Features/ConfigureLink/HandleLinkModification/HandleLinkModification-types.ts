import type { EditorAPI } from "rich-text-area";
import type { LinkConfigPort, ModifyParams } from "#adapters/Link";

export interface HandleLinkModificationParams {
	configPort: LinkConfigPort;
	editorAPI: EditorAPI;
}

export type OnModifyCallback = (params: ModifyParams) => void;
