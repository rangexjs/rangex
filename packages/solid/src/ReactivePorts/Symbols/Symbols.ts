import type { SymbolsPublicPort } from "@rangex/editor";
import type {
	ReactiveSymbolsPort,
	ReactiveSymbolsResult,
} from "./Symbols-types";

export const Symbols = (
	publicPort: SymbolsPublicPort,
): ReactiveSymbolsResult => {
	const port: ReactiveSymbolsPort = {
		items: publicPort.items,

		insert: publicPort.insert,
	};

	const dispose = () => {
		// Nothing to unsubscribe from — items/insert are static, no onXxxUpdate.
	};

	return { port, dispose };
};
