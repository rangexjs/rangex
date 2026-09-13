import type { SymbolsItems } from "@rangex/editor";

export interface ReactiveSymbolsPort {
	items: SymbolsItems;

	insert(data: string): void;
}
