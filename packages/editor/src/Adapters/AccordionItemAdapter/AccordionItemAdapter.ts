import type { BlockComponent } from "@rangex/core";
import { extendObjectProperties } from "#utilities";
import {
	createCurrentComponentPort,
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
	OnInsertCallbackFn,
	OnWrapCallbackFn,
	UpdateStateParams,
} from "./AccordionItemAdapter-types";

export const createAccordionItemAdapter = (
	...params: CreateAccordionItemAdapterParams
): CreateAccordionItemAdapterResult => {
	const [_settings, { adapterBus }] = params;

	adapterBus.registerAdapter("accordionItem");

	// States
	const canInsertState = createStateEmitter<boolean>(false);
	const canWrapState = createStateEmitter<boolean>(false);

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const wrapEmitter = createEmitter<OnWrapCallbackFn>();

	const removePort = createRemovePort();
	const unwrapPort = createUnwrapPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();

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
