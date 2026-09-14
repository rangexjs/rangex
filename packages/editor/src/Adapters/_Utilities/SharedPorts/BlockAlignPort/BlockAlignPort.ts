import type {
	BlockAlignConfigPort,
	BlockAlignInternals,
	BlockAlignPublicPort,
	CreateBlockAlignPortResult,
	OnAlignUpdateCallbackFn,
	OnChangeAlignCallbackFn,
	UpdateStateParams,
} from "./BlockAlignPort-types";

export const createBlockAlignPort = (): CreateBlockAlignPortResult => {
	const internals: BlockAlignInternals = {
		align: "center",
	};

	// StateListeners
	const onAlignUpdateListeners: Set<OnAlignUpdateCallbackFn> = new Set();

	// CommandListeners
	const onChangeAlignListeners: Set<OnChangeAlignCallbackFn> = new Set();

	const updateState = ({ align }: UpdateStateParams) => {
		if (align !== undefined) {
			internals.align = align;

			for (const listener of onAlignUpdateListeners) {
				listener(internals.align);
			}
		}
	};

	const configPort: BlockAlignConfigPort = {
		updateBlockAlign(params) {
			updateState(params);
		},

		onChangeAlign(callback) {
			onChangeAlignListeners.add(callback);
			return () => onChangeAlignListeners.delete(callback);
		},
	};

	const publicPort: BlockAlignPublicPort = {
		get align() {
			return internals.align;
		},

		onAlignUpdate(callback) {
			onAlignUpdateListeners.add(callback);
			return () => onAlignUpdateListeners.delete(callback);
		},

		changeAlign(align) {
			for (const listener of onChangeAlignListeners) {
				listener(align);
			}
		},
	};

	return { configPort, publicPort };
};
