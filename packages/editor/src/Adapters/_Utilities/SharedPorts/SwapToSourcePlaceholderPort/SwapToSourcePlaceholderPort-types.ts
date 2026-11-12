import type { AdapterBus } from "../../AdapterBus";

export type OnSwapCallbackFn = () => void;

export interface SwapToSourcePlaceholderConfigPort {
	readonly canSwap: boolean;

	onSwap(callback: OnSwapCallbackFn): () => void;
	notifySwapToSourcePlaceholder(): void;
}

export interface SwapToSourcePlaceholderPublicPort {
	readonly canSwap: boolean;

	swap(): void;
}

export interface SwapToSourcePlaceholderPort {
	configPort: SwapToSourcePlaceholderConfigPort;
	publicPort: SwapToSourcePlaceholderPublicPort;
}

export interface CreateSwapToSourcePlaceholderPortParams {
	adapterBus: AdapterBus;
}

export interface CreateSwapToSourcePlaceholderPortResult extends SwapToSourcePlaceholderPort {}
