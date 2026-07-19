import type { UnwrapPort } from "#ports";

export interface LinkAdapterConstructorParams {
	[index: string]: never;
}

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

export interface LinkPopoverState {
	toolbarButton?: LinkToolbarButtonState;
	view?: LinkView;
	mode?: LinkMode;
	displayText?: LinkDisplayText;
	url?: LinkURL;
	toggleButtons?: LinkToggleButtons;
}

export interface UpdateLinkPopoverStateParams extends LinkPopoverState {}

export interface EmitApplyParams {
	text: string;
	url: string;
	isNewTab: boolean;
}

export interface EmitInsertParams extends EmitApplyParams {}
export interface EmitModifyParams extends EmitApplyParams {}

export type LinkOnToolbarClickFn = () => void;
export type LinkOnViewChangeFn = (view: LinkView) => void;
export type LinkOnCancelFn = () => void;
export type LinkOnInsertFn = (params: EmitInsertParams) => void;
export type LinkOnModifyFn = (params: EmitModifyParams) => void;

export interface LinkEditorPort extends UnwrapPort {
	popover: HTMLDivElement;
	updateState(params: LinkPopoverState): void;
	onToolbarClick(callback: LinkOnToolbarClickFn): () => void;
	onViewChange(callback: LinkOnViewChangeFn): () => void;
	onCancel(callback: LinkOnCancelFn): () => void;
	onInsert(callback: LinkOnInsertFn): () => void;
	onModify(callback: LinkOnModifyFn): () => void;
}

export type LinkUpdateToolbarButtonFn = (value: LinkToolbarButtonState) => void;
export type LinkUpdateViewFn = (value: LinkView) => void;
export type LinkUpdateModeFn = (value: LinkMode) => void;
export type LinkUpdateDisplayTextFn = (value: LinkDisplayText) => void;
export type LinkUpdateURLFn = (value: LinkURL) => void;
export type LinkUpdateToggleButtonsFn = (value: LinkToggleButtons) => void;

export type LinkListenerOption =
	| { type: "toolbarButton"; callback: LinkUpdateToolbarButtonFn }
	| { type: "view"; callback: LinkUpdateViewFn }
	| { type: "mode"; callback: LinkUpdateModeFn }
	| { type: "displayText"; callback: LinkUpdateDisplayTextFn }
	| { type: "url"; callback: LinkUpdateURLFn }
	| { type: "toggleButtons"; callback: LinkUpdateToggleButtonsFn };

export type LinkUpdateListenerParams = LinkListenerOption & {
	operation: "add" | "delete";
};

export interface LinkUIPort {
	readonly toolbarButton: LinkToolbarButtonState;
	readonly view: LinkView;
	readonly mode: LinkMode;
	readonly displayText: LinkDisplayText;
	readonly url: LinkURL;
	readonly toggleButtons: LinkToggleButtons;
	subscribe(params: LinkListenerOption): void;
	unsubscribe(params: LinkListenerOption): void;
	setPopover(element: HTMLDivElement): void;
	/**
	 * Temporary — state changes should only ever come from the Editor. `LinkEdit`/`LinkPreview`
	 * currently update `view` directly as a pre-Adapter-era shortcut; this is kept as-is during
	 * the migration rather than rerouted through the Editor. Remove once that's fixed.
	 */
	setView(view: LinkView): void;
	emitToolbarClick(): void;
	emitViewChange(): void;
	emitCancel(): void;
	emitInsert(params: EmitInsertParams): void;
	emitModify(params: EmitModifyParams): void;
	emitUnwrap(): void;
}
