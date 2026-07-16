import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI, HTMLLayout } from "rich-text-area";
import type { BlockPopoverAppearanceHandler } from "../../BlockPopoverAppearanceHandler";
import type { BlockResize } from "../../BlockResize";
import type { OnMediaResolveFn } from "../ConfigureEmptyMedia";

export interface ConfigureAudioParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockResize: BlockResize;
	blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler;
	onMediaResolve: OnMediaResolveFn;
}

/**
 * Tracks which audio the shared swap popover is currently targeting — set whenever it's
 * opened via the edit popover's Swap button, read when Update is clicked. The swap popover
 * isn't tied to {@link BlockPopoverAppearanceHandler}'s hover-driven current-block tracking,
 * so this is its own source of truth.
 */
export interface AudioInternals {
	currentAudioFigure: HTMLLayout | null;
}
