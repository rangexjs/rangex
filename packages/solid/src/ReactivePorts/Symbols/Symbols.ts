import type { SymbolsPublicPort } from "@rangex/editor";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveSymbolsPort } from "./Symbols-types";

export const Symbols = <T extends SymbolsPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveSymbolsPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveSymbolsPort>;
	}

	const port: ReactiveSymbolsPort = {
		items: publicPort.items,

		insert: publicPort.insert,
	};

	return port as PreserveUndefined<T, ReactiveSymbolsPort>;
};
