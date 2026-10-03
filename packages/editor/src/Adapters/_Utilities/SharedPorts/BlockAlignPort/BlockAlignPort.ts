import { createEmitter } from "../../CreateEmitter";
import { createStateEmitter } from "../../CreateStateEmitter";
import type {
	BlockAlignConfigPort,
	BlockAlignPublicPort,
	BlockAlignValue,
	CreateBlockAlignPortResult,
	OnChangeAlignCallbackFn,
	UpdateStateParams,
} from "./BlockAlignPort-types";

export const createBlockAlignPort = (): CreateBlockAlignPortResult => {
	// States
	const alignState = createStateEmitter<BlockAlignValue>("center");

	// CommandListeners
	const changeAlignEmitter = createEmitter<OnChangeAlignCallbackFn>();

	const updateState = ({ align }: UpdateStateParams) => {
		if (align !== undefined) {
			alignState.set(align);
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
			return alignState.get();
		},

		onAlignUpdate(callback) {
			return alignState.subscribe(callback);
		},

		changeAlign(align) {
			changeAlignEmitter.emit(align);
		},
	};

	return { configPort, publicPort };
};
