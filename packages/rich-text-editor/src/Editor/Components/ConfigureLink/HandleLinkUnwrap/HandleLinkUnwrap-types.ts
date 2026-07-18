import type { EditorAPI } from "rich-text-area";
import type { LinkPort } from "#ports";
import type { LinkInternals } from "../ConfigureLink-types";

export type OnUnwrapCallback = Parameters<LinkPort["onUnwrap"]>[0];

export interface HandleLinkUnwrapParams {
	linkPort: LinkPort;
	editorAPI: EditorAPI;
	internals: LinkInternals;
}
