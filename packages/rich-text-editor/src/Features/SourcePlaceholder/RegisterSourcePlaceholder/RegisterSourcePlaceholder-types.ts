import type { RangeXEditor } from "@rangex/editor";
import type { SourcePlaceholderSlotSettings } from "../SourcePlaceholderSlot";

export interface RegisterSourcePlaceholderParams {
	editor: RangeXEditor;
	settings: SourcePlaceholderSlotSettings;
}
