import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { BlockNestedContext } from "rich-text-area";
import type { ImageInternals } from "../ConfigureImage-types";

export interface HandleImageSwapPopoverToggleParams {
	richTextEditorUI: RichTextEditorUI;
	getCurrentBlock: () => BlockNestedContext | null;
	internals: ImageInternals;
}
