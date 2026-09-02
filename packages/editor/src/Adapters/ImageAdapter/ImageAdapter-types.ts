import type {
	BlockAlignPort,
	BlockAlignValue,
	BlockResize,
	CaptionPort,
	CaptionPosition,
	CaptionState,
	CreateAdapterConstructor,
	OnMediaResolveCallbackFn,
} from "../_Utilities";

export interface Settings {}

export type ConstructorParams = CreateAdapterConstructor<Settings>;

export interface ImageState {
	align?: BlockAlignValue;
	caption?: CaptionState;
	isOpen?: boolean;
}

export interface UpdateStateParams extends ImageState {}

export interface ImageConfigPort extends BlockAlignPort, CaptionPort {
	readonly blockResize: BlockResize;
	readonly floatingEl: HTMLDivElement;

	updateState(params: UpdateStateParams): void;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export type OnAlignUpdateCallbackFn = (value: BlockAlignValue) => void;
export type OnCaptionUpdateCallbackFn = (value: CaptionState) => void;
export type OnIsOpenUpdateCallbackFn = (value: boolean) => void;

export interface ImagePublicPort {
	readonly floatingEl: HTMLDivElement;

	readonly align: BlockAlignValue;
	readonly caption: CaptionState;
	readonly isOpen: boolean;

	onAlignUpdate(callback: OnAlignUpdateCallbackFn): () => void;
	onCaptionUpdate(callback: OnCaptionUpdateCallbackFn): () => void;
	onIsOpenUpdate(callback: OnIsOpenUpdateCallbackFn): () => void;

	changeAlign(align: BlockAlignValue): void;
	changeCaptionEnabled(enabled: boolean): void;
	changeCaptionPosition(position: CaptionPosition): void;
}
