import type { MediaType, RangeXEditor } from "@rangex/editor";
import type { EmptyMediaPublicPort } from "@rangex/editor/empty-media";
import type { Accessor } from "solid-js";
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
	resolve(type: MediaType, src: string | File): Promise<void>;
}
