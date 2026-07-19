import type { EditorAPI } from "rich-text-area";
import type { LinkEditorPort } from "#adapters";
import type { LinkInternals } from "../ConfigureLink-types";

export type OnModifyCallback = Parameters<LinkEditorPort["onModify"]>[0];

export interface HandleLinkModificationParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
