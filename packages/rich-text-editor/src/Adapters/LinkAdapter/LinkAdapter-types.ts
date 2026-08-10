import type { CreateAdapterConstructor } from "#ports";
import type {
	EditorOverlayMount,
	UIOverlayMount,
	UnwrapPort,
} from "../_Utilities";

export type LinkAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export interface LinkToolbarButtonState {
	checked: boolean;
	disabled: boolean;
}

export type LinkView = "preview" | "edit";
export type LinkMode = "insert" | "modify";

export interface LinkDisplayText {
	inputValue: string;
	disabled: boolean;
}

export interface LinkURL {
	inputValue: string;
}

export interface LinkToggleButtons {
	isNewTab: boolean;
}

export interface LinkState {
	toolbarButton?: LinkToolbarButtonState;
	view?: LinkView;
	mode?: LinkMode;
	displayText?: LinkDisplayText;
	url?: LinkURL;
	toggleButtons?: LinkToggleButtons;
}

export interface UpdateLinkStateParams extends LinkState {}

export interface EmitApplyParams {
	text: string;
	url: string;
	isNewTab: boolean;
}

export interface EmitInsertParams extends EmitApplyParams {}
export interface EmitModifyParams extends EmitApplyParams {}

export type LinkUpdateToolbarButtonFn = (value: LinkToolbarButtonState) => void;
export type LinkUpdateViewFn = (value: LinkView) => void;
export type LinkUpdateModeFn = (value: LinkMode) => void;
export type LinkUpdateDisplayTextFn = (value: LinkDisplayText) => void;
export type LinkUpdateURLFn = (value: LinkURL) => void;
export type LinkUpdateToggleButtonsFn = (value: LinkToggleButtons) => void;

export interface LinkUIPort {
	readonly anchoredOverlay: UIOverlayMount;
	readonly toolbarButton: LinkToolbarButtonState;
	readonly view: LinkView;
	readonly mode: LinkMode;
	readonly displayText: LinkDisplayText;
	readonly url: LinkURL;
	readonly toggleButtons: LinkToggleButtons;
	onToolbarButtonUpdate(callback: LinkUpdateToolbarButtonFn): () => void;
	onViewUpdate(callback: LinkUpdateViewFn): () => void;
	onModeUpdate(callback: LinkUpdateModeFn): () => void;
	onDisplayTextUpdate(callback: LinkUpdateDisplayTextFn): () => void;
	onUrlUpdate(callback: LinkUpdateURLFn): () => void;
	onToggleButtonsUpdate(callback: LinkUpdateToggleButtonsFn): () => void;
	emitToolbarClick(): void;
	emitViewChange(view: LinkView): void;
	emitCancel(): void;
	emitInsert(params: EmitInsertParams): void;
	emitModify(params: EmitModifyParams): void;
	emitUnwrap(): void;
}

export type LinkOnToolbarClickFn = () => void;
export type LinkOnViewChangeFn = (view: LinkView) => void;
export type LinkOnCancelFn = () => void;
export type LinkOnInsertFn = (params: EmitInsertParams) => void;
export type LinkOnModifyFn = (params: EmitModifyParams) => void;

export interface LinkEditorPort extends UnwrapPort {
	readonly anchoredOverlay: EditorOverlayMount;
	updateState(params: LinkState): void;
	onToolbarClick(callback: LinkOnToolbarClickFn): () => void;
	onViewChange(callback: LinkOnViewChangeFn): () => void;
	onCancel(callback: LinkOnCancelFn): () => void;
	onInsert(callback: LinkOnInsertFn): () => void;
	onModify(callback: LinkOnModifyFn): () => void;
}
