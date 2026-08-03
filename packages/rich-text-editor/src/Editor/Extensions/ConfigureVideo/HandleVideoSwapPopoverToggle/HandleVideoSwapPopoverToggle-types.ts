import type { BlockComponent } from "rich-text-area";
import type { VideoEditorPort } from "#adapters";
import type { VideoInternals } from "../ConfigureVideo-types";

export interface HandleVideoSwapPopoverToggleParams {
	editorPort: VideoEditorPort;
	getCurrentBlock: () => BlockComponent | null;
	internals: VideoInternals;
}
