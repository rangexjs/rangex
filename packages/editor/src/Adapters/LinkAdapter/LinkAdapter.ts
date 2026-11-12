import type { InlineComponent } from "@rangex/core";

import type { LinkAttrsShape } from "#dom-attrs";
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
	ChangeDisplayTextParams,
	CreateLinkAdapterParams,
	CreateLinkAdapterResult,
	InsertParams,
	LinkConfigPort,
	LinkConfigPortProps,
	LinkInternals,
	LinkPublicPort,
	LinkPublicPortProps,
	OnChangeDisplayTextCallbackFn,
	OnInsertCallbackFn,
	OnLinkClickCallbackFn,
	OnLinkMenuToggleCallbackFn,
	OnLinkSelectionInCallbackFn,
	UpdateStateParams,
} from "./LinkAdapter-types";

export const createLinkAdapter = (...params: CreateLinkAdapterParams): CreateLinkAdapterResult => {
	const [{ linkMenu = defaultLinkMenuSettings }, { adapterBus, floatingContainer }] = params;

	adapterBus.registerAdapter("link");

	const linkAttrValidators = adapterBus.getAttrValidators("link");

	const linkMenuEl = document.createElement("div");
	floatingContainer.append(linkMenuEl);

	const internals: LinkInternals = {
		// Providers
		displayTextProvider: null,
	};

	// States
	const canInsertState = createStateEmitter<boolean>(false);

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const changeDisplayTextEmitter = createEmitter<OnChangeDisplayTextCallbackFn>();
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

			onChangeDisplayText(callback) {
				return changeDisplayTextEmitter.subscribe(callback);
			},

			registerDisplayText(provider) {
				internals.displayTextProvider = provider;
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

			changeDisplayText(params: ChangeDisplayTextParams) {
				changeDisplayTextEmitter.emit(params);
			},

			getDisplayText() {
				if (!internals.displayTextProvider) {
					throw new Error("DisplayText provider wasn't registered.");
				}

				return internals.displayTextProvider();
			},
		} satisfies LinkPublicPortProps,
	);

	return { configPort, publicPort };
};
