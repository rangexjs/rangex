import type {
	CaretMenuConfigPort,
	CaretMenuPublicPort,
	CreateAdapterParams,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

export interface SelectParams {
	userId: string;
	displayText: string;
}

export interface DisplayTextMismatch {
	reason: string;
}

export type ValidateDisplayTextResult = DisplayTextMismatch | null;

export type OnSelectCallbackFn = (params: SelectParams) => void;
export type ValidateDisplayTextProviderFn = (
	displayText: string,
) => ValidateDisplayTextResult;

export interface MentionConfigPortProps {
	readonly caretMenu: CaretMenuConfigPort;

	onSelect(callback: OnSelectCallbackFn): () => void;

	registerValidateDisplayText(provider: ValidateDisplayTextProviderFn): void;
}

export interface MentionConfigPort
	extends MentionConfigPortProps,
		UnwrapConfigPort {}

export interface MentionPublicPortProps {
	readonly caretMenu: CaretMenuPublicPort;

	select(params: SelectParams): void;

	validateDisplayText(displayText: string): ValidateDisplayTextResult;
}

export interface MentionPublicPort
	extends MentionPublicPortProps,
		UnwrapPublicPort {}

export interface MentionInternals {
	validateDisplayTextProvider: ValidateDisplayTextProviderFn | null;
}

export interface MentionAdapter {
	configPort: MentionConfigPort;
	publicPort: MentionPublicPort;
}

export interface MentionSettings {}

export interface CreateMentionAdapterParams
	extends CreateAdapterParams<MentionSettings> {}

export interface CreateMentionAdapterResult extends MentionAdapter {}
