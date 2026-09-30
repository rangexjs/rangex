import type { BlockComponent } from "rich-text-area";
import { extendObjectProperties } from "#utilities";
import {
	createCurrentComponentPort,
	createEmitter,
	createUnwrapPort,
} from "../_Utilities";
import type {
	CreateListAdapterParams,
	CreateListAdapterResult,
	ListConfigPort,
	ListConfigPortProps,
	ListInternals,
	ListPublicPort,
	ListPublicPortProps,
	OnCanInsertUpdateCallbackFn,
	OnCanWrapUpdateCallbackFn,
	OnChangeLocalNameCallbackFn,
	OnInsertCallbackFn,
	OnLocalNameUpdateCallbackFn,
	OnWrapCallbackFn,
	UpdateStateParams,
} from "./ListAdapter-types";

export const createListAdapter = (
	...params: CreateListAdapterParams
): CreateListAdapterResult => {
	const [_settings, { adapterBus }] = params;

	adapterBus.registerAdapter("list");

	const internals: ListInternals = {
		// States
		canInsert: false,
		canWrap: false,
		localName: null,
	};

	// StateListeners
	const canInsertUpdateEmitter = createEmitter<OnCanInsertUpdateCallbackFn>();
	const canWrapUpdateEmitter = createEmitter<OnCanWrapUpdateCallbackFn>();
	const localNameUpdateEmitter = createEmitter<OnLocalNameUpdateCallbackFn>();

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
			internals.canInsert = canInsert;

			canInsertUpdateEmitter.emit(internals.canInsert);
		}

		if (canWrap !== undefined) {
			internals.canWrap = canWrap;

			canWrapUpdateEmitter.emit(internals.canWrap);
		}

		if (localName !== undefined) {
			internals.localName = localName;

			localNameUpdateEmitter.emit(internals.localName);
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
				return internals.canInsert;
			},

			get canWrap() {
				return internals.canWrap;
			},

			get localName() {
				return internals.localName;
			},

			onCanInsertUpdate(callback) {
				return canInsertUpdateEmitter.subscribe(callback);
			},

			onCanWrapUpdate(callback) {
				return canWrapUpdateEmitter.subscribe(callback);
			},

			onLocalNameUpdate(callback) {
				return localNameUpdateEmitter.subscribe(callback);
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
