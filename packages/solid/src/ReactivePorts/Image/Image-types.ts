import type {
	BlockAlignValue,
	CaptionPosition,
	CaptionState,
	ImagePublicPort,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveImagePort {
	readonly raw: ImagePublicPort;

	readonly floatingEl: HTMLDivElement;

	isOpen: Accessor<boolean>;
	caption: Accessor<CaptionState>;
	align: Accessor<BlockAlignValue>;

	changeCaptionEnabled(enabled: boolean): void;
	changeCaptionPosition(position: CaptionPosition): void;
	changeAlign(align: BlockAlignValue): void;
}

export interface ReactiveImageResult {
	port: ReactiveImagePort;
	dispose: () => void;
}
