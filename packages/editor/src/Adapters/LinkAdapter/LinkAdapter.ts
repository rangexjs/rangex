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
	OnLinkClickEventCallbackFn,
	OnLinkMenuToggleCallbackFn,
	OnLinkSelectionInEventCallbackFn,
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
		canInsert: false,
		displayTextProvider: null,
	};

	// ConfigPort
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	const onModifyListeners: Set<OnModifyCallbackFn> = new Set();

	// PublicPort
	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> =
		new Set();
	const onLinkClickEventListeners: Set<OnLinkClickEventCallbackFn> = new Set();
	const onLinkSelectionInEventListeners: Set<OnLinkSelectionInEventCallbackFn> =
		new Set();
	const onLinkMenuToggleListeners: Set<OnLinkMenuToggleCallbackFn> = new Set();

	const unwrapPort = createUnwrapPort();
	const currentComponentPort = createCurrentComponentPort<InlineComponent>();
	const selectionMenuPort = createSelectionMenuPort({ floatingContainer });

	const updateState = ({ canInsert }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			for (const listener of onCanInsertUpdateListeners) {
				listener(internals.canInsert);
			}
		}
	};

	const configPort: LinkConfigPort = extendObjectProperties(
		unwrapPort.configPort,
		currentComponentPort.configPort,
		selectionMenuPort.configPort,
		{
			get linkMenuEl() {
				return linkMenuEl;
			},

			get linkMenu() {
				return linkMenu;
			},

			updateState(params) {
				updateState(params);
			},

			emitLinkClick() {
				for (const listener of onLinkClickEventListeners) {
					listener();
				}
			},

			emitLinkSelectionIn() {
				for (const listener of onLinkSelectionInEventListeners) {
					listener();
				}
			},

			emitLinkMenuToggle() {
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
		selectionMenuPort.publicPort,
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

			onCanInsertUpdate(callback) {
				onCanInsertUpdateListeners.add(callback);
				return () => onCanInsertUpdateListeners.delete(callback);
			},

			onLinkClickEvent(callback) {
				onLinkClickEventListeners.add(callback);
				return () => onLinkClickEventListeners.delete(callback);
			},

			onLinkSelectionInEvent(callback) {
				onLinkSelectionInEventListeners.add(callback);
				return () => onLinkSelectionInEventListeners.delete(callback);
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
