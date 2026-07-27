import type { EditorAPI, HTMLLayout } from "rich-text-area";
import type { AudioEditorPort } from "#adapters";

export interface ConfigureAudioParams {
	editorPort: AudioEditorPort;
	editorAPI: EditorAPI;
}

/**
 * Tracks which audio the swap popover is currently targeting — set when the edit popover's
 * Swap button opens it, read when Update is clicked. The swap popover isn't tied to
 * {@link OverlayAppearanceHandler}'s hover-driven current-block tracking, so this is its own
 * source of truth.
 */
export interface AudioInternals {
	currentAudioFigure: HTMLLayout | null;
}
