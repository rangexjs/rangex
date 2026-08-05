import type { CreateAdapterConstructor, MediaResolveParams } from "#ports";
import type {
	BlockAlignPort,
	BlockAlignValue,
	CaptionPort,
	CaptionPosition,
	CaptionState,
	EditorBlockResize,
	EditorOverlayMount,
	UIBlockResize,
	UIOverlayMount,
} from "../_Utilities";

export type EmbedAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export type EmbedAspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";

export type EmbedSwapCheckState =
	| { status: "idle" }
	| { status: "error"; message: string };

export interface EmbedState {
	align?: BlockAlignValue;
	aspectRatio?: EmbedAspectRatioValue;
	caption?: CaptionState;
	title?: string;
	swapCheckState?: EmbedSwapCheckState;
	isQuickActionsOpen?: boolean;
	isSwapCardOpen?: boolean;
}

export interface UpdateEmbedStateParams extends EmbedState {}

export interface EmbedEmitSwapParams {
	url: string;
}

export type EmbedUpdateAlignFn = (value: BlockAlignValue) => void;
export type EmbedUpdateAspectRatioFn = (value: EmbedAspectRatioValue) => void;
export type EmbedUpdateCaptionFn = (value: CaptionState) => void;
export type EmbedUpdateTitleFn = (value: string) => void;
export type EmbedUpdateSwapCheckStateFn = (value: EmbedSwapCheckState) => void;
export type EmbedUpdateIsQuickActionsOpenFn = (value: boolean) => void;
export type EmbedUpdateIsSwapCardOpenFn = (value: boolean) => void;

export interface EmbedUIPort {
	readonly quickActionsOverlay: UIOverlayMount;
	readonly swapCardOverlay: UIOverlayMount;
	readonly blockResize: UIBlockResize;
	readonly align: BlockAlignValue;
	readonly aspectRatio: EmbedAspectRatioValue;
	readonly caption: CaptionState;
	readonly title: string;
	readonly swapCheckState: EmbedSwapCheckState;
	readonly isSwapCardOpen: boolean;
	onAlignUpdate(callback: EmbedUpdateAlignFn): () => void;
	onAspectRatioUpdate(callback: EmbedUpdateAspectRatioFn): () => void;
	onCaptionUpdate(callback: EmbedUpdateCaptionFn): () => void;
	onTitleUpdate(callback: EmbedUpdateTitleFn): () => void;
	onSwapCheckStateUpdate(callback: EmbedUpdateSwapCheckStateFn): () => void;
	onIsQuickActionsOpenUpdate(
		callback: EmbedUpdateIsQuickActionsOpenFn,
	): () => void;
	onIsSwapCardOpenUpdate(callback: EmbedUpdateIsSwapCardOpenFn): () => void;
	emitAlignChange(align: BlockAlignValue): void;
	emitCaptionEnabledChange(enabled: boolean): void;
	emitCaptionPositionChange(position: CaptionPosition): void;
	emitEmbedAttrChange(params: EmbedAttrChange): void;
	emitSwap(params: EmbedEmitSwapParams): void;
	emitToggleSwap(): void;
}

export interface EmbedAttrChange {
	aspectRatio?: EmbedAspectRatioValue;
	title?: string;
}

export type OnEmbedAttrChangeFn = (params: EmbedAttrChange) => void;
export type OnEmbedSwapFn = (params: EmbedEmitSwapParams) => void;
export type OnEmbedToggleSwapFn = () => void;

export interface EmbedEditorPort extends BlockAlignPort, CaptionPort {
	readonly quickActionsOverlay: EditorOverlayMount;
	readonly swapCardOverlay: EditorOverlayMount;
	readonly blockResize: EditorBlockResize;
	updateState(params: UpdateEmbedStateParams): void;
	onEmbedAttrChange(callback: OnEmbedAttrChangeFn): () => void;
	onSwap(callback: OnEmbedSwapFn): () => void;
	onToggleSwap(callback: OnEmbedToggleSwapFn): () => void;
	onMediaResolve(callback: (params: MediaResolveParams) => void): () => void;
}
