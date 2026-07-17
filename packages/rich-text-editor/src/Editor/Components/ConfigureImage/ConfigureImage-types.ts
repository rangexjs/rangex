import type { EditorAPI, HTMLLayout } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";
import type { BlockPopoverAppearanceHandler } from "../../BlockPopoverAppearanceHandler";
import type { BlockResize } from "../../BlockResize";
import type { OnMediaResolveFn } from "../ConfigureEmptyMedia";

export interface ConfigureImageParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockResize: BlockResize;
	blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler;
	onMediaResolve: OnMediaResolveFn;
}

/**
 * Tracks which image the swap popover is currently targeting — set when the edit popover's
 * Swap button opens it, read when Update is clicked. The swap popover isn't tied to
 * {@link BlockPopoverAppearanceHandler}'s hover-driven current-block tracking, so this is
 * its own source of truth.
 */
export interface ImageInternals {
	currentImageFigure: HTMLLayout | null;
}
