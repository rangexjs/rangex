import { createEmitter } from "../../CreateEmitter";
import type {
	CreateSwapToEmptyMediaPortParams,
	CreateSwapToEmptyMediaPortResult,
	OnSwapCallbackFn,
	SwapToEmptyMediaConfigPort,
	SwapToEmptyMediaPublicPort,
} from "./SwapToEmptyMediaPort-types";

export const createSwapToEmptyMediaPort = ({
	adapterBus,
}: CreateSwapToEmptyMediaPortParams): CreateSwapToEmptyMediaPortResult => {
	// CommandListeners
	const swapEmitter = createEmitter<OnSwapCallbackFn>();

	const configPort: SwapToEmptyMediaConfigPort = {
		get canSwap() {
			return adapterBus.isEmptyMediaAvailable();
		},

		onSwap(callback) {
			return swapEmitter.subscribe(callback);
		},

		notifySwapToEmptyMedia() {
			adapterBus.emitSwapToEmptyMedia();
		},
	};

	const publicPort: SwapToEmptyMediaPublicPort = {
		get canSwap() {
			return adapterBus.isEmptyMediaAvailable();
		},

		swap() {
			swapEmitter.emit();
		},
	};

	return { configPort, publicPort };
};
