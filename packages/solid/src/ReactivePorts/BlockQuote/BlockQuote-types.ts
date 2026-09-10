import type { Accessor } from "solid-js";

export interface ReactiveBlockQuotePort {
	canInsert: Accessor<boolean>;
	canWrap: Accessor<boolean>;

	insert(): void;
	wrap(): void;
}

export interface ReactiveBlockQuoteResult {
	port: ReactiveBlockQuotePort;
	dispose: () => void;
}
