import { extendObjectProperties } from "#utilities";
import { createRemovePort, createUnwrapPort } from "../_Utilities";
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
	..._params: CreateAccordionItemAdapterParams
): CreateAccordionItemAdapterResult => {
	const internals: AccordionItemInternals = {
		canInsert: false,
		canWrap: false,
		isActive: false,
	};

	// ConfigPort
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	const onWrapListeners: Set<OnWrapCallbackFn> = new Set();

	// PublicPort
	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> =
		new Set();
	const onCanWrapUpdateListeners: Set<OnCanWrapUpdateCallbackFn> = new Set();
	const onIsActiveUpdateListeners: Set<OnIsActiveUpdateCallbackFn> = new Set();

	const removePort = createRemovePort();
	const unwrapPort = createUnwrapPort();

	const updateState = ({ canInsert, canWrap, isActive }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			for (const listener of onCanInsertUpdateListeners) {
				listener(internals.canInsert);
			}
		}

		if (canWrap !== undefined) {
			internals.canWrap = canWrap;

			for (const listener of onCanWrapUpdateListeners) {
				listener(internals.canWrap);
			}
		}

		if (isActive !== undefined) {
			internals.isActive = isActive;

			for (const listener of onIsActiveUpdateListeners) {
				listener(internals.isActive);
			}
		}
	};

	const configPort: AccordionItemConfigPort = extendObjectProperties(
		removePort.configPort,
		unwrapPort.configPort,
		{
			updateState(params) {
				updateState(params);
			},

			onInsert(callback) {
				onInsertListeners.add(callback);
				return () => onInsertListeners.delete(callback);
			},

			onWrap(callback) {
				onWrapListeners.add(callback);
				return () => onWrapListeners.delete(callback);
			},
		} satisfies AccordionItemConfigPortProps,
	);

	const publicPort: AccordionItemPublicPort = extendObjectProperties(
		removePort.publicPort,
		unwrapPort.publicPort,
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
				onCanInsertUpdateListeners.add(callback);
				return () => onCanInsertUpdateListeners.delete(callback);
			},

			onCanWrapUpdate(callback) {
				onCanWrapUpdateListeners.add(callback);
				return () => onCanWrapUpdateListeners.delete(callback);
			},

			onIsActiveUpdate(callback) {
				onIsActiveUpdateListeners.add(callback);
				return () => onIsActiveUpdateListeners.delete(callback);
			},

			insert() {
				for (const listener of onInsertListeners) {
					listener();
				}
			},

			wrap() {
				for (const listener of onWrapListeners) {
					listener();
				}
			},
		} satisfies AccordionItemPublicPortProps,
	);

	return { configPort, publicPort };
};
