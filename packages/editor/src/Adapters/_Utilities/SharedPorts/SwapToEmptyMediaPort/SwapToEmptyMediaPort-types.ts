import type { AdapterBus } from "../../AdapterBus";

export type OnSwapCallbackFn = () => void;

export interface SwapToEmptyMediaConfigPort {
	readonly canSwap: boolean;

	onSwap(callback: OnSwapCallbackFn): () => void;
	notifySwapToEmptyMedia(): void;
}

export interface SwapToEmptyMediaPublicPort {
	readonly canSwap: boolean;

	swap(): void;
}

export interface SwapToEmptyMediaPort {
	configPort: SwapToEmptyMediaConfigPort;
	publicPort: SwapToEmptyMediaPublicPort;
}

export interface CreateSwapToEmptyMediaPortParams {
	adapterBus: AdapterBus;
}

export interface CreateSwapToEmptyMediaPortResult
	extends SwapToEmptyMediaPort {}
