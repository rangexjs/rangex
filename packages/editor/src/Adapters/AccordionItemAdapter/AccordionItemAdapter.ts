import type { BlockComponent } from "rich-text-area";
import { extendObjectProperties } from "#utilities";
import {
	createCurrentComponentPort,
	createEmitter,
	createRemovePort,
	createUnwrapPort,
} from "../_Utilities";
import type {
	AccordionItemConfigPort,
	AccordionItemConfigPortProps,
	AccordionItemInternals,
	AccordionItemPublicPort,
	AccordionItemPublicPortProps,
	CreateAccordionItemAdapterParams,
	CreateAccordionItemAdapterResult,
	OnCanInsertUpdateCallbackFn,
	OnCanWrapUpdateCallbackFn,
	OnInsertCallbackFn,
	OnIsActiveUpdateCallbackFn,
	OnWrapCallbackFn,
	UpdateStateParams,
} from "./AccordionItemAdapter-types";

export const createAccordionItemAdapter = (
	...params: CreateAccordionItemAdapterParams
): CreateAccordionItemAdapterResult => {
	const [_settings, { adapterBus }] = params;

	adapterBus.registerAdapter("accordionItem");

	const internals: AccordionItemInternals = {
		// States
		canInsert: false,
		canWrap: false,
		isActive: false,
	};

	// StateListeners
	const canInsertUpdateEmitter = createEmitter<OnCanInsertUpdateCallbackFn>();
	const canWrapUpdateEmitter = createEmitter<OnCanWrapUpdateCallbackFn>();
	const isActiveUpdateEmitter = createEmitter<OnIsActiveUpdateCallbackFn>();

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const wrapEmitter = createEmitter<OnWrapCallbackFn>();

	const removePort = createRemovePort();
	const unwrapPort = createUnwrapPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();

	const updateState = ({ canInsert, canWrap, isActive }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			canInsertUpdateEmitter.emit(internals.canInsert);
		}

		if (canWrap !== undefined) {
			internals.canWrap = canWrap;

			canWrapUpdateEmitter.emit(internals.canWrap);
		}

		if (isActive !== undefined) {
			internals.isActive = isActive;

			isActiveUpdateEmitter.emit(internals.isActive);
		}
	};

	const configPort: AccordionItemConfigPort = extendObjectProperties(
		removePort.configPort,
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
		} satisfies AccordionItemConfigPortProps,
	);

	const publicPort: AccordionItemPublicPort = extendObjectProperties(
		removePort.publicPort,
		unwrapPort.publicPort,
		currentComponentPort.publicPort,
		{
			get canInsert() {
				return internals.canInsert;
			},

			get canWrap() {
				return internals.canWrap;
			},

			get isActive() {
				return internals.isActive;
			},

			onCanInsertUpdate(callback) {
				return canInsertUpdateEmitter.subscribe(callback);
			},

			onCanWrapUpdate(callback) {
				return canWrapUpdateEmitter.subscribe(callback);
			},

			onIsActiveUpdate(callback) {
				return isActiveUpdateEmitter.subscribe(callback);
			},

			insert() {
				insertEmitter.emit();
			},

			wrap() {
				wrapEmitter.emit();
			},
		} satisfies AccordionItemPublicPortProps,
	);

	return { configPort, publicPort };
};
