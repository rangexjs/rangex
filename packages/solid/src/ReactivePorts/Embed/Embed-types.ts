import type { BlockAlignValue, CaptionPosition } from "@rangex/editor";
import type { EmbedAttrs } from "@rangex/editor/embed";
import type { Accessor } from "solid-js";

export interface ReactiveEmbedPort {
	captionEnabled: Accessor<boolean>;
	captionPosition: Accessor<CaptionPosition>;
	align: Accessor<BlockAlignValue>;
	domAttrs: Accessor<EmbedAttrs | null>;
	currentComponent: Accessor<HTMLElement | null>;
	isSelectionActive: Accessor<boolean>;
}
