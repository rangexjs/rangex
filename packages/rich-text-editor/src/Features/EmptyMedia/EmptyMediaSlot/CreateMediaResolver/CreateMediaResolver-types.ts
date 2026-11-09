import type { RangeXEditor } from "@rangex/editor";
import type { EmptyMediaPublicPort } from "@rangex/editor/empty-media";
import type { Accessor } from "solid-js";
import type { MediaFileType } from "../../_Utilities";
import type {
	EmptyMediaSlotSettings,
	SlotStatus,
} from "../EmptyMediaSlot-types";

export interface CreateMediaResolverParams {
	editor: RangeXEditor;
	emptyMedia: EmptyMediaPublicPort;
	container: HTMLDivElement;
	settings: EmptyMediaSlotSettings;
}

export interface CreateMediaResolverResult {
	status: Accessor<SlotStatus>;
	resolveFile(type: MediaFileType, file: File): Promise<void>;
	resolveUrl(url: string): Promise<void>;
}
