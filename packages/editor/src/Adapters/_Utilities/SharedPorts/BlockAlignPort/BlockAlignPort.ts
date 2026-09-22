import { createEmitter } from "../../CreateEmitter";
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
	const alignUpdateEmitter = createEmitter<OnAlignUpdateCallbackFn>();

	// CommandListeners
	const changeAlignEmitter = createEmitter<OnChangeAlignCallbackFn>();

	const updateState = ({ align }: UpdateStateParams) => {
		if (align !== undefined) {
			internals.align = align;

			alignUpdateEmitter.emit(internals.align);
		}
	};

	const configPort: BlockAlignConfigPort = {
		updateBlockAlign(params) {
			updateState(params);
		},

		onChangeAlign(callback) {
			return changeAlignEmitter.subscribe(callback);
		},
	};

	const publicPort: BlockAlignPublicPort = {
		get align() {
			return internals.align;
		},

		onAlignUpdate(callback) {
			return alignUpdateEmitter.subscribe(callback);
		},

		changeAlign(align) {
			changeAlignEmitter.emit(align);
		},
	};

	return { configPort, publicPort };
};
