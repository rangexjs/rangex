import type { InlineComponent } from "rich-text-area";
import { extendObjectProperties } from "#utilities";
import {
	createCurrentComponentPort,
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
	OnIsActiveUpdateCallbackFn,
	OnLinkClickCallbackFn,
	OnLinkMenuToggleCallbackFn,
	OnLinkSelectionInCallbackFn,
	OnModifyCallbackFn,
	UpdateStateParams,
} from "./LinkAdapter-types";

export const createLinkAdapter = (
	...params: CreateLinkAdapterParams
): CreateLinkAdapterResult => {
	const [{ linkMenu = defaultLinkMenuSettings }, { floatingContainer }] =
		params;

	const linkMenuEl = document.createElement("div");
	floatingContainer.append(linkMenuEl);

	const internals: LinkInternals = {
		// States
		canInsert: false,
		isActive: false,
		// Providers
		displayTextProvider: null,
	};

	// StateListeners
	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> =
		new Set();
	const onIsActiveUpdateListeners: Set<OnIsActiveUpdateCallbackFn> = new Set();

	// CommandListeners
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	const onModifyListeners: Set<OnModifyCallbackFn> = new Set();
	const onLinkClickListeners: Set<OnLinkClickCallbackFn> = new Set();
	const onLinkSelectionInListeners: Set<OnLinkSelectionInCallbackFn> =
		new Set();
	const onLinkMenuToggleListeners: Set<OnLinkMenuToggleCallbackFn> = new Set();

	const unwrapPort = createUnwrapPort();
	const currentComponentPort = createCurrentComponentPort<InlineComponent>();
	const selectionMenuPort = createSelectionMenuPort({ floatingContainer });

	const updateState = ({ canInsert, isActive }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			for (const listener of onCanInsertUpdateListeners) {
				listener(internals.canInsert);
			}
		}

		if (isActive !== undefined) {
			internals.isActive = isActive;

			for (const listener of onIsActiveUpdateListeners) {
				listener(internals.isActive);
			}
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
				for (const listener of onLinkClickListeners) {
					listener();
				}
			},

			notifyLinkSelectionIn() {
				for (const listener of onLinkSelectionInListeners) {
					listener();
				}
			},

			notifyLinkMenuToggle() {
				for (const listener of onLinkMenuToggleListeners) {
					listener();
				}
			},

			onInsert(callback) {
				onInsertListeners.add(callback);
				return () => onInsertListeners.delete(callback);
			},

			onModify(callback) {
				onModifyListeners.add(callback);
				return () => onModifyListeners.delete(callback);
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

			get isActive() {
				return internals.isActive;
			},

			get linkMenuOpen() {
				return linkMenuEl.matches(":popover-open");
			},

			get selectionMenu() {
				return selectionMenuPort.publicPort;
			},

			onCanInsertUpdate(callback) {
				onCanInsertUpdateListeners.add(callback);
				return () => onCanInsertUpdateListeners.delete(callback);
			},

			onIsActiveUpdate(callback) {
				onIsActiveUpdateListeners.add(callback);
				return () => onIsActiveUpdateListeners.delete(callback);
			},

			onLinkClick(callback) {
				onLinkClickListeners.add(callback);
				return () => onLinkClickListeners.delete(callback);
			},

			onLinkSelectionIn(callback) {
				onLinkSelectionInListeners.add(callback);
				return () => onLinkSelectionInListeners.delete(callback);
			},

			onLinkMenuToggle(callback) {
				onLinkMenuToggleListeners.add(callback);
				return () => onLinkMenuToggleListeners.delete(callback);
			},

			insert(params: InsertParams) {
				for (const listener of onInsertListeners) {
					listener(params);
				}
			},

			modify(params: ModifyParams) {
				for (const listener of onModifyListeners) {
					listener(params);
				}
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
