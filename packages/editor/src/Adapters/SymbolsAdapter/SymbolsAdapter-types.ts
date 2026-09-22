import type { CreateAdapterParams } from "../_Utilities";

export type SymbolsItems = string[];

export type OnInsertCallbackFn = (data: string) => void;

export interface SymbolsConfigPortProps {
	onInsert(callback: OnInsertCallbackFn): () => void;
}

export interface SymbolsConfigPort extends SymbolsConfigPortProps {}

export interface SymbolsPublicPortProps {
	readonly items: SymbolsItems;

	insert(data: string): void;
}

export interface SymbolsPublicPort extends SymbolsPublicPortProps {}

export interface SymbolsAdapter {
	configPort: SymbolsConfigPort;
	publicPort: SymbolsPublicPort;
}

export interface SymbolsSettings {
	items?: SymbolsItems;
}

export interface CreateSymbolsAdapterParams
	extends CreateAdapterParams<SymbolsSettings> {}

export interface CreateSymbolsAdapterResult extends SymbolsAdapter {}
