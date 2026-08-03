import type { BlockComponent } from "rich-text-area";
import type { EmbedEditorPort } from "#adapters";
import type { EmbedInternals } from "../ConfigureEmbed-types";

export interface HandleEmbedSwapPopoverToggleParams {
	editorPort: EmbedEditorPort;
	getCurrentBlock: () => BlockComponent | null;
	internals: EmbedInternals;
}
