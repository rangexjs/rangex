import type { BlockAlignValue, CaptionPosition } from "@rangex/editor";
import type { AudioAttrs } from "@rangex/editor/audio";
import type { Accessor } from "solid-js";

export interface ReactiveAudioPort {
	captionEnabled: Accessor<boolean>;
	captionPosition: Accessor<CaptionPosition>;
	align: Accessor<BlockAlignValue>;
	domAttrs: Accessor<AudioAttrs | null>;
	currentComponent: Accessor<HTMLElement | null>;
	isSelectionActive: Accessor<boolean>;
}
