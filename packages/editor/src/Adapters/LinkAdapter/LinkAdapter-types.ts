import type { InlineComponent } from "@rangex/core";
import type {
	CreateLinkAttrValidatorsParams,
	LinkAttrs,
	LinkAttrsMismatch,
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

interface InsertDisplayText {
	type: "insert";
}

interface SingleWrapDisplayText {
	type: "single-wrap";
	value: string;
}

interface MultipleWrapDisplayText {
	type: "multiple-wrap";
}

interface EditDisplayText {
	type: "edit";
	value: string;
}

export type LinkDisplayText =
	| InsertDisplayText
	| SingleWrapDisplayText
	| MultipleWrapDisplayText
	| EditDisplayText
	| null;

export interface InsertParams {
	text: string;
	attrs: LinkAttrs;
}

export interface PlacementValidationParams {
	attrs: LinkAttrs;
}

export type PlacementValidationResult = LinkAttrsMismatch | null;

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
export type PlacementValidatorFn = (
	params: PlacementValidationParams,
) => PlacementValidationResult;

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
	registerPlacementValidator(validator: PlacementValidatorFn): void;
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
	validatePlacement(
		params: PlacementValidationParams,
	): PlacementValidationResult;
}

export interface LinkPublicPort
	extends LinkPublicPortProps,
		UnwrapPublicPort,
		CurrentComponentPublicPort,
		DOMAttrsPublicPort<LinkAttrsShape> {}

export interface LinkInternals {
	displayTextProvider: DisplayTextProviderFn | null;
	placementValidator: PlacementValidatorFn | null;
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
