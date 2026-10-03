import type { BlockComponent, ListLocalName } from "@rangex/core";
import { extendObjectProperties } from "#utilities";
import {
	createCurrentComponentPort,
	createEmitter,
	createStateEmitter,
	createUnwrapPort,
} from "../_Utilities";
import type {
	CreateListAdapterParams,
	CreateListAdapterResult,
	ListConfigPort,
	ListConfigPortProps,
	ListPublicPort,
	ListPublicPortProps,
	OnChangeLocalNameCallbackFn,
	OnInsertCallbackFn,
	OnWrapCallbackFn,
	UpdateStateParams,
} from "./ListAdapter-types";

export const createListAdapter = (
	...params: CreateListAdapterParams
): CreateListAdapterResult => {
	const [_settings, { adapterBus }] = params;

	adapterBus.registerAdapter("list");

	// States
	const canInsertState = createStateEmitter<boolean>(false);
	const canWrapState = createStateEmitter<boolean>(false);
	const localNameState = createStateEmitter<ListLocalName | null>(null);

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const wrapEmitter = createEmitter<OnWrapCallbackFn>();
	const changeLocalNameEmitter = createEmitter<OnChangeLocalNameCallbackFn>();

	const unwrapPort = createUnwrapPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();

	const updateState = ({
		canInsert,
		canWrap,
		localName,
	}: UpdateStateParams) => {
		if (canInsert !== undefined) {
			canInsertState.set(canInsert);
		}

		if (canWrap !== undefined) {
			canWrapState.set(canWrap);
		}

		if (localName !== undefined) {
			localNameState.set(localName);
		}
	};

	const configPort: ListConfigPort = extendObjectProperties(
		unwrapPort.configPort,
		currentComponentPort.configPort,
		{
			updateState(params) {
				updateState(params);
			},

			onInsert(callback) {
				return insertEmitter.subscribe(callback);
			},

			onWrap(callback) {
				return wrapEmitter.subscribe(callback);
			},

			onChangeLocalName(callback) {
				return changeLocalNameEmitter.subscribe(callback);
			},
		} satisfies ListConfigPortProps,
	);

	const publicPort: ListPublicPort = extendObjectProperties(
		unwrapPort.publicPort,
		currentComponentPort.publicPort,
		{
			get canInsert() {
				return canInsertState.get();
			},

			get canWrap() {
				return canWrapState.get();
			},

			get localName() {
				return localNameState.get();
			},

			onCanInsertUpdate(callback) {
				return canInsertState.subscribe(callback);
			},

			onCanWrapUpdate(callback) {
				return canWrapState.subscribe(callback);
			},

			onLocalNameUpdate(callback) {
				return localNameState.subscribe(callback);
			},

			insert(params) {
				insertEmitter.emit(params);
			},

			wrap(params) {
				wrapEmitter.emit(params);
			},

			changeLocalName(localName) {
				changeLocalNameEmitter.emit(localName);
			},
		} satisfies ListPublicPortProps,
	);

	return { configPort, publicPort };
};
