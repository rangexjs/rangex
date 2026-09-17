import type { BlockComponent } from "rich-text-area";
import { extendObjectProperties } from "#utilities";
import {
	createCurrentComponentPort,
	createQuickActionsPort,
	createRemovePort,
	createUnwrapPort,
} from "../_Utilities";
import type {
	CodeBlockConfigPort,
	CodeBlockConfigPortProps,
	CodeBlockInternals,
	CodeBlockPublicPort,
	CodeBlockPublicPortProps,
	CreateCodeBlockAdapterParams,
	CreateCodeBlockAdapterResult,
	OnCanInsertUpdateCallbackFn,
	OnCanWrapUpdateCallbackFn,
	OnChangeLanguageCallbackFn,
	OnChangeThemeCallbackFn,
	OnInsertCallbackFn,
	OnIsActiveUpdateCallbackFn,
	OnLanguageUpdateCallbackFn,
	OnThemeUpdateCallbackFn,
	OnWrapCallbackFn,
	UpdateStateParams,
} from "./CodeBlockAdapter-types";

export const createCodeBlockAdapter = (
	...params: CreateCodeBlockAdapterParams
): CreateCodeBlockAdapterResult => {
	const [settings, { floatingContainer }] = params;

	const internals: CodeBlockInternals = {
		// States
		canInsert: false,
		canWrap: false,
		isActive: false,
		language: null,
		theme: null,
		// Providers
		plainTextProvider: null,
		// Rest
		languages: settings.languages ?? [],
		themes: settings.themes ?? [],
		getHighlightInfo: settings.getHighlightInfo ?? null,
		defaultTheme: settings.defaultTheme ?? null,
	};

	// StateListeners
	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> =
		new Set();
	const onCanWrapUpdateListeners: Set<OnCanWrapUpdateCallbackFn> = new Set();
	const onIsActiveUpdateListeners: Set<OnIsActiveUpdateCallbackFn> = new Set();
	const onLanguageUpdateListeners: Set<OnLanguageUpdateCallbackFn> = new Set();
	const onThemeUpdateListeners: Set<OnThemeUpdateCallbackFn> = new Set();

	// CommandListeners
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	const onWrapListeners: Set<OnWrapCallbackFn> = new Set();
	const onChangeLanguageListeners: Set<OnChangeLanguageCallbackFn> = new Set();
	const onChangeThemeListeners: Set<OnChangeThemeCallbackFn> = new Set();

	const removePort = createRemovePort();
	const unwrapPort = createUnwrapPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();
	const quickActionsPort = createQuickActionsPort({ floatingContainer });

	const updateState = ({
		canInsert,
		canWrap,
		isActive,
		language,
		theme,
	}: UpdateStateParams) => {
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

		if (language !== undefined) {
			internals.language = language;

			for (const listener of onLanguageUpdateListeners) {
				listener(internals.language);
			}
		}

		if (theme !== undefined) {
			internals.theme = theme;

			for (const listener of onThemeUpdateListeners) {
				listener(internals.theme);
			}
		}
	};

	const configPort: CodeBlockConfigPort = extendObjectProperties(
		removePort.configPort,
		unwrapPort.configPort,
		currentComponentPort.configPort,
		{
			get quickActions() {
				return quickActionsPort.configPort;
			},

			get getHighlightInfo() {
				return internals.getHighlightInfo;
			},

			get defaultTheme() {
				return internals.defaultTheme;
			},

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

			onChangeLanguage(callback) {
				onChangeLanguageListeners.add(callback);
				return () => onChangeLanguageListeners.delete(callback);
			},

			onChangeTheme(callback) {
				onChangeThemeListeners.add(callback);
				return () => onChangeThemeListeners.delete(callback);
			},

			registerPlainTextProvider(provider) {
				internals.plainTextProvider = provider;
			},
		} satisfies CodeBlockConfigPortProps,
	);

	const publicPort: CodeBlockPublicPort = extendObjectProperties(
		removePort.publicPort,
		unwrapPort.publicPort,
		currentComponentPort.publicPort,
		{
			get quickActions() {
				return quickActionsPort.publicPort;
			},

			get languages() {
				return internals.languages;
			},

			get themes() {
				return internals.themes;
			},

			get defaultTheme() {
				return internals.defaultTheme;
			},

			get canHighlight() {
				return (
					internals.getHighlightInfo !== null &&
					internals.languages.length > 0 &&
					internals.themes.length > 0 &&
					internals.defaultTheme !== null
				);
			},

			get canInsert() {
				return internals.canInsert;
			},

			get canWrap() {
				return internals.canWrap;
			},

			get isActive() {
				return internals.isActive;
			},

			get language() {
				return internals.language;
			},

			get theme() {
				return internals.theme;
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

			onLanguageUpdate(callback) {
				onLanguageUpdateListeners.add(callback);
				return () => onLanguageUpdateListeners.delete(callback);
			},

			onThemeUpdate(callback) {
				onThemeUpdateListeners.add(callback);
				return () => onThemeUpdateListeners.delete(callback);
			},

			insert(params) {
				for (const listener of onInsertListeners) {
					listener(params);
				}
			},

			wrap(params) {
				for (const listener of onWrapListeners) {
					listener(params);
				}
			},

			changeLanguage(language) {
				for (const listener of onChangeLanguageListeners) {
					listener(language);
				}
			},

			changeTheme(theme) {
				for (const listener of onChangeThemeListeners) {
					listener(theme);
				}
			},

			getPlainText() {
				if (!internals.plainTextProvider) {
					throw new Error("Plain text provider wasn't registered.");
				}

				return internals.plainTextProvider();
			},
		} satisfies CodeBlockPublicPortProps,
	);

	return { configPort, publicPort };
};
