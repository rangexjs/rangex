import type { BlockComponent } from "@rangex/core";

import type { AccordionItemAttrsShape } from "#dom-attrs";
import { extendObjectProperties } from "#utilities";

import {
	createCurrentComponentPort,
	createDOMAttrsPort,
	createEmitter,
	createRemovePort,
	createStateEmitter,
	createUnwrapPort,
} from "../_Utilities";
import type {
	AccordionItemConfigPort,
	AccordionItemConfigPortProps,
	AccordionItemPublicPort,
	AccordionItemPublicPortProps,
	CreateAccordionItemAdapterParams,
	CreateAccordionItemAdapterResult,
	InsertParams,
	OnInsertCallbackFn,
	OnWrapCallbackFn,
	UpdateStateParams,
	WrapParams,
} from "./AccordionItemAdapter-types";

export const createAccordionItemAdapter = (
	...params: CreateAccordionItemAdapterParams
): CreateAccordionItemAdapterResult => {
	const [_settings, { adapterBus }] = params;

	adapterBus.registerAdapter("accordionItem");

	const accordionItemAttrValidators = adapterBus.getAttrValidators("accordionItem");

	// States
	const canInsertState = createStateEmitter<boolean>(false);
	const canWrapState = createStateEmitter<boolean>(false);

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const wrapEmitter = createEmitter<OnWrapCallbackFn>();

	const removePort = createRemovePort();
	const unwrapPort = createUnwrapPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();
	const domAttrsPort = createDOMAttrsPort<AccordionItemAttrsShape>();

	const updateState = ({ canInsert, canWrap }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			canInsertState.set(canInsert);
		}

		if (canWrap !== undefined) {
			canWrapState.set(canWrap);
		}
	};

	const configPort: AccordionItemConfigPort = extendObjectProperties(
		removePort.configPort,
		unwrapPort.configPort,
		currentComponentPort.configPort,
		domAttrsPort.configPort,
		{
			get attrValidators() {
				return accordionItemAttrValidators;
			},

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
		domAttrsPort.publicPort,
		{
			get canInsert() {
				return canInsertState.get();
			},

			get canWrap() {
				return canWrapState.get();
			},

			onCanInsertUpdate(callback) {
				return canInsertState.subscribe(callback);
			},

			onCanWrapUpdate(callback) {
				return canWrapState.subscribe(callback);
			},

			insert(params: InsertParams) {
				insertEmitter.emit(params);
			},

			wrap(params: WrapParams) {
				wrapEmitter.emit(params);
			},
		} satisfies AccordionItemPublicPortProps,
	);

	return { configPort, publicPort };
};
