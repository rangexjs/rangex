import { extendObjectProperties } from "#utilities";
import { createUnwrapPort } from "../_Utilities";
import type {
	ApplyParams,
	CreateLinkAdapterParams,
	CreateLinkAdapterResult,
	LinkConfigPort,
	LinkConfigPortProps,
	LinkInternals,
	LinkPublicPort,
	LinkPublicPortProps,
	OnCanApplyUpdateCallbackFn,
	OnCancelCallbackFn,
	OnDisplayTextUpdateCallbackFn,
	OnInsertCallbackFn,
	OnModeUpdateCallbackFn,
	OnModifyCallbackFn,
	OnToggleButtonsUpdateCallbackFn,
	OnToolbarClickCallbackFn,
	OnUrlUpdateCallbackFn,
	OnViewChangeCallbackFn,
	OnViewUpdateCallbackFn,
	UpdateStateParams,
} from "./LinkAdapter-types";

export const createLinkAdapter = (
	...params: CreateLinkAdapterParams
): CreateLinkAdapterResult => {
	const [_settings, { floatingContainer }] = params;

	const overlayEl = document.createElement("div");
	floatingContainer.append(overlayEl);

	const internals: LinkInternals = {
		canApply: false,
		view: "preview",
		mode: "insert",
		displayText: { inputValue: "", disabled: false },
		url: { inputValue: "" },
		toggleButtons: { isNewTab: false },
	};

	// ConfigPort
	const onToolbarClickListeners: Set<OnToolbarClickCallbackFn> = new Set();
	const onViewChangeListeners: Set<OnViewChangeCallbackFn> = new Set();
	const onCancelListeners: Set<OnCancelCallbackFn> = new Set();
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	const onModifyListeners: Set<OnModifyCallbackFn> = new Set();

	// PublicPort
	const onCanApplyUpdateListeners: Set<OnCanApplyUpdateCallbackFn> = new Set();
	const onViewUpdateListeners: Set<OnViewUpdateCallbackFn> = new Set();
	const onModeUpdateListeners: Set<OnModeUpdateCallbackFn> = new Set();
	const onDisplayTextUpdateListeners: Set<OnDisplayTextUpdateCallbackFn> =
		new Set();
	const onUrlUpdateListeners: Set<OnUrlUpdateCallbackFn> = new Set();
	const onToggleButtonsUpdateListeners: Set<OnToggleButtonsUpdateCallbackFn> =
		new Set();

	const unwrapPort = createUnwrapPort();

	const updateState = ({
		canApply,
		view,
		mode,
		displayText,
		url,
		toggleButtons,
	}: UpdateStateParams) => {
		if (canApply !== undefined) {
			internals.canApply = canApply;

			for (const listener of onCanApplyUpdateListeners) {
				listener(internals.canApply);
			}
		}

		if (view !== undefined) {
			internals.view = view;

			for (const listener of onViewUpdateListeners) {
				listener(internals.view);
			}
		}

		if (mode !== undefined) {
			internals.mode = mode;

			for (const listener of onModeUpdateListeners) {
				listener(internals.mode);
			}
		}

		if (displayText !== undefined) {
			internals.displayText = displayText;

			for (const listener of onDisplayTextUpdateListeners) {
				listener(internals.displayText);
			}
		}

		if (url !== undefined) {
			internals.url = url;

			for (const listener of onUrlUpdateListeners) {
				listener(internals.url);
			}
		}

		if (toggleButtons !== undefined) {
			internals.toggleButtons = toggleButtons;

			for (const listener of onToggleButtonsUpdateListeners) {
				listener(internals.toggleButtons);
			}
		}
	};

	const configPort: LinkConfigPort = extendObjectProperties(
		unwrapPort.configPort,
		{
			get overlayEl() {
				return overlayEl;
			},

			updateState(params) {
				updateState(params);
			},

			onToolbarClick(callback) {
				onToolbarClickListeners.add(callback);
				return () => onToolbarClickListeners.delete(callback);
			},

			onViewChange(callback) {
				onViewChangeListeners.add(callback);
				return () => onViewChangeListeners.delete(callback);
			},

			onCancel(callback) {
				onCancelListeners.add(callback);
				return () => onCancelListeners.delete(callback);
			},

			onInsert(callback) {
				onInsertListeners.add(callback);
				return () => onInsertListeners.delete(callback);
			},

			onModify(callback) {
				onModifyListeners.add(callback);
				return () => onModifyListeners.delete(callback);
			},
		} satisfies LinkConfigPortProps,
	);

	const publicPort: LinkPublicPort = extendObjectProperties(
		unwrapPort.publicPort,
		{
			get overlayEl() {
				return overlayEl;
			},

			get canApply() {
				return internals.canApply;
			},

			get view() {
				return internals.view;
			},

			get mode() {
				return internals.mode;
			},

			get displayText() {
				return internals.displayText;
			},

			get url() {
				return internals.url;
			},

			get toggleButtons() {
				return internals.toggleButtons;
			},

			onCanApplyUpdate(callback) {
				onCanApplyUpdateListeners.add(callback);
				return () => onCanApplyUpdateListeners.delete(callback);
			},

			onViewUpdate(callback) {
				onViewUpdateListeners.add(callback);
				return () => onViewUpdateListeners.delete(callback);
			},

			onModeUpdate(callback) {
				onModeUpdateListeners.add(callback);
				return () => onModeUpdateListeners.delete(callback);
			},

			onDisplayTextUpdate(callback) {
				onDisplayTextUpdateListeners.add(callback);
				return () => onDisplayTextUpdateListeners.delete(callback);
			},

			onUrlUpdate(callback) {
				onUrlUpdateListeners.add(callback);
				return () => onUrlUpdateListeners.delete(callback);
			},

			onToggleButtonsUpdate(callback) {
				onToggleButtonsUpdateListeners.add(callback);
				return () => onToggleButtonsUpdateListeners.delete(callback);
			},

			toolbarClick() {
				for (const listener of onToolbarClickListeners) {
					listener();
				}
			},

			viewChange(view) {
				for (const listener of onViewChangeListeners) {
					listener(view);
				}
			},

			cancel() {
				for (const listener of onCancelListeners) {
					listener();
				}
			},

			insert(params: ApplyParams) {
				for (const listener of onInsertListeners) {
					listener(params);
				}
			},

			modify(params: ApplyParams) {
				for (const listener of onModifyListeners) {
					listener(params);
				}
			},
		} satisfies LinkPublicPortProps,
	);

	return { configPort, publicPort };
};
