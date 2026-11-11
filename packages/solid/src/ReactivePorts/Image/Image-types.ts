import type { BlockAlignValue, CaptionPosition } from "@rangex/editor";
import type { ImageAttrs } from "@rangex/editor/image";
import type { Accessor } from "solid-js";

export interface ReactiveImagePort {
	captionEnabled: Accessor<boolean>;
	captionPosition: Accessor<CaptionPosition>;
	align: Accessor<BlockAlignValue>;
	domAttrs: Accessor<ImageAttrs | null>;
	currentComponent: Accessor<HTMLElement | null>;
	isSelectionActive: Accessor<boolean>;
}
