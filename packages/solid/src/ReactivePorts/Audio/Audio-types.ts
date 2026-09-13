import type {
	BlockAlignValue,
	CaptionPosition,
	CaptionState,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveAudioPort {
	readonly quickActionsEl: HTMLDivElement;
	readonly canSwap: boolean;

	quickActionsOpen: Accessor<boolean>;
	caption: Accessor<CaptionState>;
	align: Accessor<BlockAlignValue>;
	currentBlock: Accessor<HTMLElement | null>;

	changeCaptionEnabled(enabled: boolean): void;
	changeCaptionPosition(position: CaptionPosition): void;
	changeAlign(align: BlockAlignValue): void;
	commitSnapshot(): void;
	swap(): void;
}
