import type { BlockComponent } from "rich-text-area";
import type { ImageEditorPort } from "#adapters";
import type { ImageInternals } from "../ConfigureImage-types";

export interface HandleImageSwapPopoverToggleParams {
	editorPort: ImageEditorPort;
	getCurrentBlock: () => BlockComponent | null;
	internals: ImageInternals;
}
