import type { BlockAlignPort, BlockAlignValue } from "./_Shared/BlockAlignPort";
import type { CaptionPort, CaptionState } from "./_Shared/CaptionPort";
import type { DeletePort } from "./_Shared/DeletePort";

export type EmbedAspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";

export type EmbedSwapCheckState =
	| { status: "idle" }
	| { status: "error"; message: string };

export interface EmbedPopoverState {
	align?: BlockAlignValue;
	aspectRatio?: EmbedAspectRatioValue;
	caption?: CaptionState;
	title?: string;
	swapCheckState?: EmbedSwapCheckState;
}

export interface UpdateEmbedPopoverStateParams extends EmbedPopoverState {}

export interface EmbedAttrChange {
	aspectRatio?: EmbedAspectRatioValue;
	title?: string;
}

export type OnEmbedAttrChangeFn = (params: EmbedAttrChange) => void;

export interface EmbedEmitSwapParams {
	url: string;
}

export type OnEmbedSwapFn = (params: EmbedEmitSwapParams) => void;

export interface EmbedPort extends BlockAlignPort, CaptionPort, DeletePort {
	popover: HTMLDivElement;
	swapPopover: HTMLDivElement;
	updateState(params: UpdateEmbedPopoverStateParams): void;
	onEmbedAttrChange(callback: OnEmbedAttrChangeFn): () => void;
	onSwap(callback: OnEmbedSwapFn): () => void;
}
