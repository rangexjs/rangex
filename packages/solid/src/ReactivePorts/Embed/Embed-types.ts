import type { BlockAlignValue, CaptionPosition } from "@rangex/editor";
import type { Accessor } from "solid-js";
import type { ReactiveQuickActionsPort } from "../../_Utilities";

export interface ReactiveEmbedPort {
	readonly quickActions: ReactiveQuickActionsPort;
	readonly canSwap: boolean;

	captionEnabled: Accessor<boolean>;
	captionPosition: Accessor<CaptionPosition>;
	align: Accessor<BlockAlignValue>;
	currentBlock: Accessor<HTMLElement | null>;

	changeCaptionEnabled(enabled: boolean): void;
	changeCaptionPosition(position: CaptionPosition): void;
	changeAlign(align: BlockAlignValue): void;
	commitSnapshot(): void;
	swap(): void;
}
