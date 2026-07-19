import type { EditorAPI } from "rich-text-area";
import type { LinkPort } from "#ports";
import type { LinkInternals } from "../ConfigureLink-types";

export type OnModifyCallback = Parameters<LinkPort["onModify"]>[0];

export interface HandleLinkModificationParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
