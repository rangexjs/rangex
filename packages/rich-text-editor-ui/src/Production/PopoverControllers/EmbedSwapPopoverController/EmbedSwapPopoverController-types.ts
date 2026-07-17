export interface EmbedEmitSwapParams {
	url: string;
}

export type OnEmbedSwapFn = (params: EmbedEmitSwapParams) => void;

export type EmbedSwapCheckState =
	| { status: "idle" }
	| { status: "error"; message: string };

export type OnEmbedSwapCheckStateChangeFn = (
	state: EmbedSwapCheckState,
) => void;

export interface EmbedSwapPopover {
	popover: HTMLDivElement;
	onSwap(callback: OnEmbedSwapFn): () => void;
	updateCheckState(state: EmbedSwapCheckState): void;
	onCheckStateChange(callback: OnEmbedSwapCheckStateChangeFn): () => void;
}
