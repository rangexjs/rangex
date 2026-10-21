import type { InlineComponent } from "@rangex/core";
import type {
	CreateLinkAttrValidatorsParams,
	LinkAttrs,
	LinkAttrsShape,
	LinkAttrValidators,
} from "#dom-attrs";
import type {
	CreateAdapterParams,
	CurrentComponentConfigPort,
	CurrentComponentPublicPort,
	DOMAttrsConfigPort,
	DOMAttrsPublicPort,
	SelectionMenuConfigPort,
	SelectionMenuPublicPort,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

export type LinkMenuOpenTrigger = "click" | "selection-in" | "after-insertion";

export interface LinkMenuSettings {
	openAt: LinkMenuOpenTrigger[];
}

export interface LinkDisplayText {
	value: string;
	disabled: boolean;
}

export interface InsertParams {
	text: string;
	attrs: LinkAttrs;
}

export interface ModifyParams {
	text: string;
}

export interface LinkState {
	canInsert?: boolean;
}

export type OnCanInsertUpdateCallbackFn = (value: boolean) => void;

export type OnInsertCallbackFn = (params: InsertParams) => void;
export type OnModifyCallbackFn = (params: ModifyParams) => void;
export type OnLinkClickCallbackFn = () => void;
export type OnLinkSelectionInCallbackFn = () => void;
export type OnLinkMenuToggleCallbackFn = () => void;
export type DisplayTextProviderFn = () => LinkDisplayText;

export interface UpdateStateParams extends LinkState {}

export interface LinkConfigPortProps {
	readonly linkMenuEl: HTMLDivElement;
	readonly linkMenuSettings: LinkMenuSettings;
	readonly attrValidators: LinkAttrValidators;
	readonly selectionMenu: SelectionMenuConfigPort;

	updateState(params: UpdateStateParams): void;
	notifyLinkClick(): void;
	notifyLinkSelectionIn(): void;
	notifyLinkMenuToggle(): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onModify(callback: OnModifyCallbackFn): () => void;

	registerDisplayText(provider: DisplayTextProviderFn): void;
}

export interface LinkConfigPort
	extends LinkConfigPortProps,
		UnwrapConfigPort,
		CurrentComponentConfigPort<InlineComponent>,
		DOMAttrsConfigPort<LinkAttrsShape> {}

export interface LinkPublicPortProps {
	readonly linkMenuEl: HTMLDivElement;
	readonly canInsert: boolean;
	readonly linkMenuOpen: boolean;
	readonly selectionMenu: SelectionMenuPublicPort;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onLinkClick(callback: OnLinkClickCallbackFn): () => void;
	onLinkSelectionIn(callback: OnLinkSelectionInCallbackFn): () => void;
	onLinkMenuToggle(callback: OnLinkMenuToggleCallbackFn): () => void;

	insert(params: InsertParams): void;
	modify(params: ModifyParams): void;

	getDisplayText(): LinkDisplayText;
}

export interface LinkPublicPort
	extends LinkPublicPortProps,
		UnwrapPublicPort,
		CurrentComponentPublicPort,
		DOMAttrsPublicPort<LinkAttrsShape> {}

export interface LinkInternals {
	displayTextProvider: DisplayTextProviderFn | null;
}

export interface LinkAdapter {
	configPort: LinkConfigPort;
	publicPort: LinkPublicPort;
}

export interface LinkSettings {
	linkMenu?: LinkMenuSettings;
	attrValidators?: CreateLinkAttrValidatorsParams;
}

export interface CreateLinkAdapterParams
	extends CreateAdapterParams<LinkSettings> {}

export interface CreateLinkAdapterResult extends LinkAdapter {}
