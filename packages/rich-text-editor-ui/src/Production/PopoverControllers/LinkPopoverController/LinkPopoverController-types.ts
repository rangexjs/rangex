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

export type LinkUpdateViewFn = (value: LinkView) => void;
export type LinkUpdateModeFn = (value: LinkMode) => void;
export type LinkUpdateDisplayTextFn = (value: LinkDisplayText) => void;
export type LinkUpdateURLFn = (value: LinkURL) => void;
export type LinkUpdateToggleButtonsFn = (value: LinkToggleButtons) => void;

export interface LinkPopoverState {
	view?: LinkView;
	mode?: LinkMode;
	displayText?: LinkDisplayText;
	url?: LinkURL;
	toggleButtons?: LinkToggleButtons;
}

export interface UpdateLinkPopoverStateParams extends LinkPopoverState {}

export type LinkListenerOption =
	| { type: "view"; callback: LinkUpdateViewFn }
	| { type: "mode"; callback: LinkUpdateModeFn }
	| { type: "displayText"; callback: LinkUpdateDisplayTextFn }
	| { type: "url"; callback: LinkUpdateURLFn }
	| { type: "toggleButtons"; callback: LinkUpdateToggleButtonsFn };

export type LinkUpdateListenerParams = LinkListenerOption & {
	operation: "add" | "delete";
};

export interface EmitApplyParams {
	text: string;
	url: string;
	isNewTab: boolean;
}

export interface EmitInsertParams extends EmitApplyParams {}
export interface EmitModifyParams extends EmitApplyParams {}

export type LinkOnViewChangeFn = (view: LinkView) => void;
export type LinkOnCancelFn = () => void;
export type LinkOnInsertFn = (params: EmitInsertParams) => void;
export type LinkOnModifyFn = (params: EmitModifyParams) => void;
export type LinkOnRemoveFn = () => void;

export interface LinkPopover {
	popover: HTMLDivElement;
	updateState(params: UpdateLinkPopoverStateParams): void;
	onViewChange(callback: LinkOnViewChangeFn): () => void;
	onCancel(callback: LinkOnCancelFn): () => void;
	onInsert(callback: LinkOnInsertFn): () => void;
	onModify(callback: LinkOnModifyFn): () => void;
	onRemove(callback: LinkOnRemoveFn): () => void;
}
