import type { InlineComponent } from "@rangex/core";
import { createLinkAttrValidators, type LinkAttrsShape } from "#dom-attrs";
import { extendObjectProperties } from "#utilities";
import {
	createCurrentComponentPort,
	createDOMAttrsPort,
	createEmitter,
	createSelectionMenuPort,
	createStateEmitter,
	createUnwrapPort,
} from "../_Utilities";
import { defaultLinkMenuSettings } from "./LinkAdapter-default";
import type {
	CreateLinkAdapterParams,
	CreateLinkAdapterResult,
	InsertParams,
	LinkConfigPort,
	LinkConfigPortProps,
	LinkInternals,
	LinkPublicPort,
	LinkPublicPortProps,
	ModifyParams,
	OnInsertCallbackFn,
	OnLinkClickCallbackFn,
	OnLinkMenuToggleCallbackFn,
	OnLinkSelectionInCallbackFn,
	OnModifyCallbackFn,
	UpdateStateParams,
} from "./LinkAdapter-types";

export const createLinkAdapter = (
	...params: CreateLinkAdapterParams
): CreateLinkAdapterResult => {
	const [
		{ linkMenu = defaultLinkMenuSettings, attrValidators = {} },
		{ adapterBus, floatingContainer },
	] = params;

	const linkAttrValidators = createLinkAttrValidators(attrValidators);

	adapterBus.registerAdapter("link");
	adapterBus.registerAttrValidators("link", linkAttrValidators);

	const linkMenuEl = document.createElement("div");
	floatingContainer.append(linkMenuEl);

	const internals: LinkInternals = {
		// Providers
		displayTextProvider: null,
		placementValidator: null,
	};

	// States
	const canInsertState = createStateEmitter<boolean>(false);

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const modifyEmitter = createEmitter<OnModifyCallbackFn>();
	const linkClickEmitter = createEmitter<OnLinkClickCallbackFn>();
	const linkSelectionInEmitter = createEmitter<OnLinkSelectionInCallbackFn>();
	const linkMenuToggleEmitter = createEmitter<OnLinkMenuToggleCallbackFn>();

	const unwrapPort = createUnwrapPort();
	const currentComponentPort = createCurrentComponentPort<InlineComponent>();
	const domAttrsPort = createDOMAttrsPort<LinkAttrsShape>();
	const selectionMenuPort = createSelectionMenuPort({ floatingContainer });

	const updateState = ({ canInsert }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			canInsertState.set(canInsert);
		}
	};

	const configPort: LinkConfigPort = extendObjectProperties(
		unwrapPort.configPort,
		currentComponentPort.configPort,
		domAttrsPort.configPort,
		{
			get linkMenuEl() {
				return linkMenuEl;
			},

			get linkMenuSettings() {
				return linkMenu;
			},

			get attrValidators() {
				return linkAttrValidators;
			},

			get selectionMenu() {
				return selectionMenuPort.configPort;
			},

			updateState(params) {
				updateState(params);
			},

			notifyLinkClick() {
				linkClickEmitter.emit();
			},

			notifyLinkSelectionIn() {
				linkSelectionInEmitter.emit();
			},

			notifyLinkMenuToggle() {
				linkMenuToggleEmitter.emit();
			},

			onInsert(callback) {
				return insertEmitter.subscribe(callback);
			},

			onModify(callback) {
				return modifyEmitter.subscribe(callback);
			},

			registerDisplayText(provider) {
				internals.displayTextProvider = provider;
			},

			registerPlacementValidator(validator) {
				internals.placementValidator = validator;
			},
		} satisfies LinkConfigPortProps,
	);

	const publicPort: LinkPublicPort = extendObjectProperties(
		unwrapPort.publicPort,
		currentComponentPort.publicPort,
		domAttrsPort.publicPort,
		{
			get linkMenuEl() {
				return linkMenuEl;
			},

			get canInsert() {
				return canInsertState.get();
			},

			get linkMenuOpen() {
				return linkMenuEl.matches(":popover-open");
			},

			get selectionMenu() {
				return selectionMenuPort.publicPort;
			},

			onCanInsertUpdate(callback) {
				return canInsertState.subscribe(callback);
			},

			onLinkClick(callback) {
				return linkClickEmitter.subscribe(callback);
			},

			onLinkSelectionIn(callback) {
				return linkSelectionInEmitter.subscribe(callback);
			},

			onLinkMenuToggle(callback) {
				return linkMenuToggleEmitter.subscribe(callback);
			},

			insert(params: InsertParams) {
				insertEmitter.emit(params);
			},

			modify(params: ModifyParams) {
				modifyEmitter.emit(params);
			},

			getDisplayText() {
				if (!internals.displayTextProvider) {
					throw new Error("DisplayText provider wasn't registered.");
				}

				return internals.displayTextProvider();
			},

			validatePlacement(params) {
				if (!internals.placementValidator) {
					throw new Error("PlacementValidator wasn't registered.");
				}

				return internals.placementValidator(params);
			},
		} satisfies LinkPublicPortProps,
	);

	return { configPort, publicPort };
};
