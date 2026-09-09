import type { SymbolsItems } from "@rangex/editor";

export interface ReactiveSymbolsPort {
	items: SymbolsItems;

	insert(data: string): void;
}

export interface ReactiveSymbolsResult {
	port: ReactiveSymbolsPort;
	dispose: () => void;
}
