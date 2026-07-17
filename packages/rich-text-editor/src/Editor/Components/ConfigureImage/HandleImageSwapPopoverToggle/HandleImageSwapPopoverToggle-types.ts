import type { BlockNestedContext } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";
import type { ImageInternals } from "../ConfigureImage-types";

export interface HandleImageSwapPopoverToggleParams {
	richTextEditorUI: RichTextEditorUI;
	getCurrentBlock: () => BlockNestedContext | null;
	internals: ImageInternals;
}
