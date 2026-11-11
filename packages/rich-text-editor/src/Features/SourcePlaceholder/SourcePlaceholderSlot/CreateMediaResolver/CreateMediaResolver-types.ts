import type { RangeXEditor } from "@rangex/editor";
import type { SourcePlaceholderPublicPort } from "@rangex/editor/source-placeholder";
import type { Accessor } from "solid-js";

import type { MediaFileType } from "../../_Utilities";
import type { SlotStatus, SourcePlaceholderSlotSettings } from "../SourcePlaceholderSlot-types";

export interface CreateMediaResolverParams {
	editor: RangeXEditor;
	sourcePlaceholder: SourcePlaceholderPublicPort;
	container: HTMLDivElement;
	settings: SourcePlaceholderSlotSettings;
}

export interface CreateMediaResolverResult {
	status: Accessor<SlotStatus>;
	resolveFile(type: MediaFileType, file: File): Promise<void>;
	resolveUrl(url: string): Promise<void>;
}
