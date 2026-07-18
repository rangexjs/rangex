import type { EditorAPI } from "rich-text-area";
import type { EmbedEmitSwapParams, EmbedPort } from "#ports";
import type { EmbedInternals } from "../ConfigureEmbed-types";

export interface HandleEmbedSwapParams {
	embedPort: EmbedPort;
	editorAPI: EditorAPI;
	internals: EmbedInternals;
}

export interface ResolveSwapSrcParams {
	embedEmitSwapParams: EmbedEmitSwapParams;
	embedPort: EmbedPort;
}

export type ResolveSwapSrcResult = string | null;
