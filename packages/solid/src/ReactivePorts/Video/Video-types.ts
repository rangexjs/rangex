import type {
	BlockAlignValue,
	CaptionPosition,
	CaptionState,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveVideoPort {
	readonly floatingEl: HTMLDivElement;
	readonly canSwap: boolean;

	isOpen: Accessor<boolean>;
	caption: Accessor<CaptionState>;
	align: Accessor<BlockAlignValue>;
	currentBlock: Accessor<HTMLElement | null>;

	changeCaptionEnabled(enabled: boolean): void;
	changeCaptionPosition(position: CaptionPosition): void;
	changeAlign(align: BlockAlignValue): void;
	commitSnapshot(): void;
	swap(): void;
}

export interface ReactiveVideoResult {
	port: ReactiveVideoPort;
	dispose: () => void;
}
