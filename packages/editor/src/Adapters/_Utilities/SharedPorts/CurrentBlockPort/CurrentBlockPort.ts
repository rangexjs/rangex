import type {
	CreateCurrentBlockPortResult,
	CurrentBlockConfigPort,
	CurrentBlockInternals,
	CurrentBlockPublicPort,
	OnCurrentBlockUpdateCallbackFn,
	UpdateStateParams,
} from "./CurrentBlockPort-types";

export const createCurrentBlockPort = (): CreateCurrentBlockPortResult => {
	const internals: CurrentBlockInternals = {
		currentBlock: null,
	};

	// PublicPort
	const onCurrentBlockUpdateListeners: Set<OnCurrentBlockUpdateCallbackFn> =
		new Set();

	const updateState = ({ currentBlock }: UpdateStateParams) => {
		if (currentBlock !== undefined) {
			internals.currentBlock = currentBlock;

			for (const listener of onCurrentBlockUpdateListeners) {
				listener(internals.currentBlock);
			}
		}
	};

	const configPort: CurrentBlockConfigPort = {
		setCurrentBlock(currentBlock) {
			updateState({ currentBlock });
		},
	};

	const publicPort: CurrentBlockPublicPort = {
		get currentBlock() {
			return internals.currentBlock;
		},

		onCurrentBlockUpdate(callback) {
			onCurrentBlockUpdateListeners.add(callback);
			return () => onCurrentBlockUpdateListeners.delete(callback);
		},
	};

	return { configPort, publicPort };
};
