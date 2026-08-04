import type { EditorAPI, HTMLLayout } from "rich-text-area";
import type { VideoEditorPort } from "#adapters";

export interface ConfigureVideoParams {
	editorPort: VideoEditorPort;
	editorAPI: EditorAPI;
}

/**
 * Tracks which video the swap overlay is currently targeting — set when the quick-actions'
 * Swap button opens it, read when Update is clicked. The swap overlay isn't tied to
 * {@link OverlayAppearanceHandler}'s hover-driven current-block tracking, so this is its own
 * source of truth.
 */
export interface VideoInternals {
	currentVideoFigure: HTMLLayout | null;
}
