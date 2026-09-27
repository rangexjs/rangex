import type { BlockAlignValue, CaptionPosition } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveImagePort {
	captionEnabled: Accessor<boolean>;
	captionPosition: Accessor<CaptionPosition>;
	align: Accessor<BlockAlignValue>;
	currentComponent: Accessor<HTMLElement | null>;
	isSelectionActive: Accessor<boolean>;
}
