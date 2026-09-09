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
	// ConfigPort
	const onSwapListeners: Set<OnSwapCallbackFn> = new Set();

	const configPort: SwapToEmptyMediaConfigPort = {
		get canSwap() {
			return adapterBus.isEmptyMediaAvailable();
		},

		onSwap(callback) {
			onSwapListeners.add(callback);
			return () => onSwapListeners.delete(callback);
		},

		emitSwapToEmptyMedia() {
			adapterBus.emitSwapToEmptyMedia();
		},
	};

	const publicPort: SwapToEmptyMediaPublicPort = {
		get canSwap() {
			return adapterBus.isEmptyMediaAvailable();
		},

		swap() {
			for (const listener of onSwapListeners) {
				listener();
			}
		},
	};

	return { configPort, publicPort };
};
