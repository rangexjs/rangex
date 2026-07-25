import type { BlockNestedContext } from "rich-text-area";
import type { EmbedEditorPort } from "#adapters";
import type { EmbedInternals } from "../ConfigureEmbed-types";

export interface HandleEmbedSwapPopoverToggleParams {
	editorPort: EmbedEditorPort;
	getCurrentBlock: () => BlockNestedContext | null;
	internals: EmbedInternals;
}
