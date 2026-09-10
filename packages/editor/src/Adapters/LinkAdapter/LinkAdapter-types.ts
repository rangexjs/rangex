import type {
	CreateAdapterParams,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

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

export interface ApplyParams {
	text: string;
	url: string;
	isNewTab: boolean;
}

export interface LinkState {
	canApply?: boolean;
	view?: LinkView;
	mode?: LinkMode;
	displayText?: LinkDisplayText;
	url?: LinkURL;
	toggleButtons?: LinkToggleButtons;
}

export interface UpdateStateParams extends LinkState {}

export type OnToolbarClickCallbackFn = () => void;
export type OnViewChangeCallbackFn = (view: LinkView) => void;
export type OnCancelCallbackFn = () => void;
export type OnInsertCallbackFn = (params: ApplyParams) => void;
export type OnModifyCallbackFn = (params: ApplyParams) => void;

export interface LinkConfigPortProps {
	readonly overlayEl: HTMLDivElement;

	updateState(params: UpdateStateParams): void;

	onToolbarClick(callback: OnToolbarClickCallbackFn): () => void;
	onViewChange(callback: OnViewChangeCallbackFn): () => void;
	onCancel(callback: OnCancelCallbackFn): () => void;
	onInsert(callback: OnInsertCallbackFn): () => void;
	onModify(callback: OnModifyCallbackFn): () => void;
}

export interface LinkConfigPort extends LinkConfigPortProps, UnwrapConfigPort {}

export type OnCanApplyUpdateCallbackFn = (value: boolean) => void;
export type OnViewUpdateCallbackFn = (value: LinkView) => void;
export type OnModeUpdateCallbackFn = (value: LinkMode) => void;
export type OnDisplayTextUpdateCallbackFn = (value: LinkDisplayText) => void;
export type OnUrlUpdateCallbackFn = (value: LinkURL) => void;
export type OnToggleButtonsUpdateCallbackFn = (
	value: LinkToggleButtons,
) => void;

export interface LinkPublicPortProps {
	readonly overlayEl: HTMLDivElement;
	readonly canApply: boolean;
	readonly view: LinkView;
	readonly mode: LinkMode;
	readonly displayText: LinkDisplayText;
	readonly url: LinkURL;
	readonly toggleButtons: LinkToggleButtons;

	onCanApplyUpdate(callback: OnCanApplyUpdateCallbackFn): () => void;
	onViewUpdate(callback: OnViewUpdateCallbackFn): () => void;
	onModeUpdate(callback: OnModeUpdateCallbackFn): () => void;
	onDisplayTextUpdate(callback: OnDisplayTextUpdateCallbackFn): () => void;
	onUrlUpdate(callback: OnUrlUpdateCallbackFn): () => void;
	onToggleButtonsUpdate(callback: OnToggleButtonsUpdateCallbackFn): () => void;

	toolbarClick(): void;
	viewChange(view: LinkView): void;
	cancel(): void;
	insert(params: ApplyParams): void;
	modify(params: ApplyParams): void;
}

export interface LinkPublicPort extends LinkPublicPortProps, UnwrapPublicPort {}

export interface LinkInternals {
	canApply: boolean;
	view: LinkView;
	mode: LinkMode;
	displayText: LinkDisplayText;
	url: LinkURL;
	toggleButtons: LinkToggleButtons;
}

export interface LinkAdapter {
	configPort: LinkConfigPort;
	publicPort: LinkPublicPort;
}

export interface LinkSettings {}

export interface CreateLinkAdapterParams
	extends CreateAdapterParams<LinkSettings> {}

export interface CreateLinkAdapterResult extends LinkAdapter {}
