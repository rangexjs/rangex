import { createEmitter } from "../../CreateEmitter";
import type {
	CreateSwapToSourcePlaceholderPortParams,
	CreateSwapToSourcePlaceholderPortResult,
	OnSwapCallbackFn,
	SwapToSourcePlaceholderConfigPort,
	SwapToSourcePlaceholderPublicPort,
} from "./SwapToSourcePlaceholderPort-types";

export const createSwapToSourcePlaceholderPort = ({
	adapterBus,
}: CreateSwapToSourcePlaceholderPortParams): CreateSwapToSourcePlaceholderPortResult => {
	// CommandListeners
	const swapEmitter = createEmitter<OnSwapCallbackFn>();

	const configPort: SwapToSourcePlaceholderConfigPort = {
		get canSwap() {
			return adapterBus.hasAdapter("sourcePlaceholder");
		},

		onSwap(callback) {
			return swapEmitter.subscribe(callback);
		},

		notifySwapToSourcePlaceholder() {
			adapterBus.emitSwapToSourcePlaceholder();
		},
	};

	const publicPort: SwapToSourcePlaceholderPublicPort = {
		get canSwap() {
			return adapterBus.hasAdapter("sourcePlaceholder");
		},

		swap() {
			swapEmitter.emit();
		},
	};

	return { configPort, publicPort };
};
