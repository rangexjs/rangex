import type {
	CaretMenuConfigPort,
	CaretMenuPublicPort,
	CreateAdapterParams,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

export interface SelectParams {
	id: string;
	name: string;
}

export type OnSelectCallbackFn = (params: SelectParams) => void;

export interface MentionConfigPortProps {
	readonly caretMenu: CaretMenuConfigPort;

	onSelect(callback: OnSelectCallbackFn): () => void;
}

export interface MentionConfigPort
	extends MentionConfigPortProps,
		UnwrapConfigPort {}

export interface MentionPublicPortProps {
	readonly caretMenu: CaretMenuPublicPort;

	select(params: SelectParams): void;
}

export interface MentionPublicPort
	extends MentionPublicPortProps,
		UnwrapPublicPort {}

export interface MentionInternals {}

export interface MentionAdapter {
	configPort: MentionConfigPort;
	publicPort: MentionPublicPort;
}

export interface MentionSettings {}

export interface CreateMentionAdapterParams
	extends CreateAdapterParams<MentionSettings> {}

export interface CreateMentionAdapterResult extends MentionAdapter {}
