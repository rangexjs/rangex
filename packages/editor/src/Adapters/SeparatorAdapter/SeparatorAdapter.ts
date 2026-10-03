import { extendObjectProperties } from "#utilities";
import { createEmitter, createStateEmitter } from "../_Utilities";
import type {
	CreateSeparatorAdapterParams,
	CreateSeparatorAdapterResult,
	OnInsertCallbackFn,
	SeparatorConfigPort,
	SeparatorConfigPortProps,
	SeparatorPublicPort,
	SeparatorPublicPortProps,
	UpdateStateParams,
} from "./SeparatorAdapter-types";

export const createSeparatorAdapter = (
	...params: CreateSeparatorAdapterParams
): CreateSeparatorAdapterResult => {
	const [_settings, { adapterBus }] = params;

	adapterBus.registerAdapter("separator");

	// States
	const canInsertState = createStateEmitter<boolean>(false);

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();

	const updateState = ({ canInsert }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			canInsertState.set(canInsert);
		}
	};

	const configPort: SeparatorConfigPort = extendObjectProperties({}, {
		updateState(params) {
			updateState(params);
		},

		onInsert(callback) {
			return insertEmitter.subscribe(callback);
		},
	} satisfies SeparatorConfigPortProps);

	const publicPort: SeparatorPublicPort = extendObjectProperties({}, {
		get canInsert() {
			return canInsertState.get();
		},

		onCanInsertUpdate(callback) {
			return canInsertState.subscribe(callback);
		},

		insert() {
			insertEmitter.emit();
		},
	} satisfies SeparatorPublicPortProps);

	return { configPort, publicPort };
};
