import type {
	BlockAlignConfigPort,
	BlockAlignInternals,
	BlockAlignPublicPort,
	CreateBlockAlignPortResult,
	OnAlignChangeCallbackFn,
	OnAlignUpdateCallbackFn,
	UpdateStateParams,
} from "./BlockAlignPort-types";

export const createBlockAlignPort = (): CreateBlockAlignPortResult => {
	const internals: BlockAlignInternals = {
		align: "center",
	};

	// ConfigPort
	const onAlignChangeListeners: Set<OnAlignChangeCallbackFn> = new Set();

	// PublicPort
	const onAlignUpdateListeners: Set<OnAlignUpdateCallbackFn> = new Set();

	const updateState = ({ align }: UpdateStateParams) => {
		if (align !== undefined) {
			internals.align = align;

			for (const listener of onAlignUpdateListeners) {
				listener(internals.align);
			}
		}
	};

	const configPort: BlockAlignConfigPort = {
		setAlign(align) {
			updateState({ align });
		},

		onAlignChange(callback) {
			onAlignChangeListeners.add(callback);
			return () => onAlignChangeListeners.delete(callback);
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
			for (const listener of onAlignChangeListeners) {
				listener(align);
			}
		},
	};

	return { configPort, publicPort };
};
