import type { SymbolsPublicPort } from "@rangex/editor";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveSymbolsPort } from "./Symbols-types";

export const Symbols = <T extends SymbolsPublicPort | undefined>(
	publicPort: T,
): FromPublicToReactivePort<T> => {
	if (!publicPort) {
		return undefined as FromPublicToReactivePort<T>;
	}

	const port: ReactiveSymbolsPort = {
		items: publicPort.items,

		insert: publicPort.insert,
	};

	return port as FromPublicToReactivePort<T>;
};
