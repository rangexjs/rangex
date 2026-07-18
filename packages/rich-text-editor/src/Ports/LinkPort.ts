import type { UnwrapPort } from "./_Shared/UnwrapPort";

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

export type LinkOnViewChangeFn = (view: LinkView) => void;
export type LinkOnCancelFn = () => void;
export type LinkOnInsertFn = (params: EmitInsertParams) => void;
export type LinkOnModifyFn = (params: EmitModifyParams) => void;

export interface LinkPort extends UnwrapPort {
	popover: HTMLDivElement;
	updateState(params: UpdateLinkPopoverStateParams): void;
	onViewChange(callback: LinkOnViewChangeFn): () => void;
	onCancel(callback: LinkOnCancelFn): () => void;
	onInsert(callback: LinkOnInsertFn): () => void;
	onModify(callback: LinkOnModifyFn): () => void;
}
