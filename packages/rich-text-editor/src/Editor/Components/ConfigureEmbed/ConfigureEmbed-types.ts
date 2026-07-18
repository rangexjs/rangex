import type { EditorAPI, HTMLLayout } from "rich-text-area";
import type { EmbedPort } from "#ports";
import type { BlockPopoverAppearanceHandler } from "../../BlockPopoverAppearanceHandler";
import type { BlockResize } from "../../BlockResize";
import type { OnMediaResolveFn } from "../ConfigureEmptyMedia";

export interface ConfigureEmbedParams {
	embedPort: EmbedPort;
	editorAPI: EditorAPI;
	blockResize: BlockResize;
	blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler;
	onMediaResolve: OnMediaResolveFn;
}

/**
 * Tracks which embed the swap popover is currently targeting — set when the popover's
 * Swap button opens it, read when Update is clicked. The swap popover isn't tied to
 * {@link BlockPopoverAppearanceHandler}'s hover-driven current-block tracking, so this is
 * its own source of truth.
 */
export interface EmbedInternals {
	currentEmbedFigure: HTMLLayout | null;
}
