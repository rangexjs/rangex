import type { BlockAlignValue, CaptionPosition } from "@rangex/editor";
import type { VideoAttrs } from "@rangex/editor/video";
import type { Accessor } from "solid-js";

export interface ReactiveVideoPort {
	captionEnabled: Accessor<boolean>;
	captionPosition: Accessor<CaptionPosition>;
	align: Accessor<BlockAlignValue>;
	domAttrs: Accessor<VideoAttrs | null>;
	currentComponent: Accessor<HTMLElement | null>;
	isSelectionActive: Accessor<boolean>;
}
