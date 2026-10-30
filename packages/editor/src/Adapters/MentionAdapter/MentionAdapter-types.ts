import type {
	CaretMenuConfigPort,
	CaretMenuPublicPort,
	CreateAdapterParams,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

export interface SelectParams {
	userId: string;
	displayName: string;
}

export interface DisplayNameMismatch {
	reason: string;
}

export type ValidateDisplayNameResult = DisplayNameMismatch | null;

export type OnSelectCallbackFn = (params: SelectParams) => void;
export type ValidateDisplayNameProviderFn = (
	displayName: string,
) => ValidateDisplayNameResult;

export interface MentionConfigPortProps {
	readonly caretMenu: CaretMenuConfigPort;

	onSelect(callback: OnSelectCallbackFn): () => void;

	registerValidateDisplayName(provider: ValidateDisplayNameProviderFn): void;
}

export interface MentionConfigPort
	extends MentionConfigPortProps,
		UnwrapConfigPort {}

export interface MentionPublicPortProps {
	readonly caretMenu: CaretMenuPublicPort;

	select(params: SelectParams): void;

	validateDisplayName(displayName: string): ValidateDisplayNameResult;
}

export interface MentionPublicPort
	extends MentionPublicPortProps,
		UnwrapPublicPort {}

export interface MentionInternals {
	validateDisplayNameProvider: ValidateDisplayNameProviderFn | null;
}

export interface MentionAdapter {
	configPort: MentionConfigPort;
	publicPort: MentionPublicPort;
}

export interface MentionSettings {}

export interface CreateMentionAdapterParams
	extends CreateAdapterParams<MentionSettings> {}

export interface CreateMentionAdapterResult extends MentionAdapter {}
