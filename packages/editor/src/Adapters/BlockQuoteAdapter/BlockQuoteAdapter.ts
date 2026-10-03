import type { BlockComponent } from "@rangex/core";
import { extendObjectProperties } from "#utilities";
import {
	createCurrentComponentPort,
	createEmitter,
	createStateEmitter,
	createUnwrapPort,
} from "../_Utilities";
import type {
	BlockQuoteConfigPort,
	BlockQuoteConfigPortProps,
	BlockQuotePublicPort,
	BlockQuotePublicPortProps,
	CreateBlockQuoteAdapterParams,
	CreateBlockQuoteAdapterResult,
	OnInsertCallbackFn,
	OnWrapCallbackFn,
	UpdateStateParams,
} from "./BlockQuoteAdapter-types";

export const createBlockQuoteAdapter = (
	...params: CreateBlockQuoteAdapterParams
): CreateBlockQuoteAdapterResult => {
	const [_settings, { adapterBus }] = params;

	adapterBus.registerAdapter("blockQuote");

	// States
	const canInsertState = createStateEmitter<boolean>(false);
	const canWrapState = createStateEmitter<boolean>(false);

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const wrapEmitter = createEmitter<OnWrapCallbackFn>();

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

	const configPort: BlockQuoteConfigPort = extendObjectProperties(
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
		} satisfies BlockQuoteConfigPortProps,
	);

	const publicPort: BlockQuotePublicPort = extendObjectProperties(
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
		} satisfies BlockQuotePublicPortProps,
	);

	return { configPort, publicPort };
};
