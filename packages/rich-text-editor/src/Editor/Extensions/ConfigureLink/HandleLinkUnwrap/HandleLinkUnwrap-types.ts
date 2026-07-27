import type { EditorAPI } from "rich-text-area";
import type { LinkEditorPort } from "#adapters";
import type { LinkInternals } from "../ConfigureLink-types";

export type OnUnwrapCallback = Parameters<LinkEditorPort["onUnwrap"]>[0];

export interface HandleLinkUnwrapParams {
	editorPort: LinkEditorPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
