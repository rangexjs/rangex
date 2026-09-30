import type { InlineComponent } from "rich-text-area";
import { extendObjectProperties } from "#utilities";
import {
	createCurrentComponentPort,
	createEmitter,
	createSelectionMenuPort,
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
	OnCanInsertUpdateCallbackFn,
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
		{ linkMenu = defaultLinkMenuSettings },
		{ adapterBus, floatingContainer },
	] = params;

	adapterBus.registerAdapter("link");

	const linkMenuEl = document.createElement("div");
	floatingContainer.append(linkMenuEl);

	const internals: LinkInternals = {
		// States
		canInsert: false,
		// Providers
		displayTextProvider: null,
	};

	// StateListeners
	const canInsertUpdateEmitter = createEmitter<OnCanInsertUpdateCallbackFn>();

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const modifyEmitter = createEmitter<OnModifyCallbackFn>();
	const linkClickEmitter = createEmitter<OnLinkClickCallbackFn>();
	const linkSelectionInEmitter = createEmitter<OnLinkSelectionInCallbackFn>();
	const linkMenuToggleEmitter = createEmitter<OnLinkMenuToggleCallbackFn>();

	const unwrapPort = createUnwrapPort();
	const currentComponentPort = createCurrentComponentPort<InlineComponent>();
	const selectionMenuPort = createSelectionMenuPort({ floatingContainer });

	const updateState = ({ canInsert }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			canInsertUpdateEmitter.emit(internals.canInsert);
		}
	};

	const configPort: LinkConfigPort = extendObjectProperties(
		unwrapPort.configPort,
		currentComponentPort.configPort,
		{
			get linkMenuEl() {
				return linkMenuEl;
			},

			get linkMenuSettings() {
				return linkMenu;
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
		} satisfies LinkConfigPortProps,
	);

	const publicPort: LinkPublicPort = extendObjectProperties(
		unwrapPort.publicPort,
		currentComponentPort.publicPort,
		{
			get linkMenuEl() {
				return linkMenuEl;
			},

			get canInsert() {
				return internals.canInsert;
			},

			get linkMenuOpen() {
				return linkMenuEl.matches(":popover-open");
			},

			get selectionMenu() {
				return selectionMenuPort.publicPort;
			},

			onCanInsertUpdate(callback) {
				return canInsertUpdateEmitter.subscribe(callback);
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
		} satisfies LinkPublicPortProps,
	);

	return { configPort, publicPort };
};
