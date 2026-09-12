import type { InlineComponent } from "rich-text-area";
import type {
	CreateAdapterParams,
	CurrentComponentConfigPort,
	CurrentComponentPublicPort,
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
	afterInsertion?: (link: HTMLElement) => void;
}

export interface ModifyParams {
	text: string;
}

export interface LinkState {
	canInsert?: boolean;
}

export interface UpdateStateParams extends LinkState {}

export type OnInsertCallbackFn = (params: InsertParams) => void;
export type OnModifyCallbackFn = (params: ModifyParams) => void;
export type DisplayTextProviderFn = () => LinkDisplayText;

export interface LinkConfigPortProps {
	readonly linkMenuEl: HTMLDivElement;
	readonly linkMenu: LinkMenuSettings;

	updateState(params: UpdateStateParams): void;
	emitLinkClick(): void;
	emitLinkSelectionIn(): void;
	emitLinkMenuToggle(): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onModify(callback: OnModifyCallbackFn): () => void;

	registerDisplayText(provider: DisplayTextProviderFn): void;
}

export interface LinkConfigPort
	extends LinkConfigPortProps,
		UnwrapConfigPort,
		CurrentComponentConfigPort<InlineComponent>,
		SelectionMenuConfigPort {}

export type OnCanInsertUpdateCallbackFn = (value: boolean) => void;
export type OnLinkClickEventCallbackFn = () => void;
export type OnLinkSelectionInEventCallbackFn = () => void;
export type OnLinkMenuToggleCallbackFn = () => void;

export interface LinkPublicPortProps {
	readonly linkMenuEl: HTMLDivElement;
	readonly canInsert: boolean;
	readonly linkMenuOpen: boolean;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onLinkClickEvent(callback: OnLinkClickEventCallbackFn): () => void;
	onLinkSelectionInEvent(
		callback: OnLinkSelectionInEventCallbackFn,
	): () => void;
	onLinkMenuToggle(callback: OnLinkMenuToggleCallbackFn): () => void;

	insert(params: InsertParams): void;
	modify(params: ModifyParams): void;

	getDisplayText(): LinkDisplayText;
}

export interface LinkPublicPort
	extends LinkPublicPortProps,
		UnwrapPublicPort,
		CurrentComponentPublicPort,
		SelectionMenuPublicPort {}

export interface LinkInternals {
	canInsert: boolean;
	displayTextProvider: DisplayTextProviderFn | null;
}

export interface LinkAdapter {
	configPort: LinkConfigPort;
	publicPort: LinkPublicPort;
}

export interface LinkSettings {
	linkMenu?: LinkMenuSettings;
}

export interface CreateLinkAdapterParams
	extends CreateAdapterParams<LinkSettings> {}

export interface CreateLinkAdapterResult extends LinkAdapter {}
