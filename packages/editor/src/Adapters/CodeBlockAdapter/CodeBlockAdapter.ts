import type { BlockComponent } from "rich-text-area";
import { extendObjectProperties } from "#utilities";
import {
	createCurrentComponentPort,
	createQuickActionsPort,
	createRemovePort,
	createUnwrapPort,
} from "../_Utilities";
import {
	defaultCodeBlockLanguages,
	defaultCodeBlockThemes,
} from "./CodeBlockAdapter-default";
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
	OnChangeDarkThemeCallbackFn,
	OnChangeLanguageCallbackFn,
	OnChangeLightThemeCallbackFn,
	OnDarkThemeUpdateCallbackFn,
	OnInsertCallbackFn,
	OnIsActiveUpdateCallbackFn,
	OnLanguageUpdateCallbackFn,
	OnLightThemeUpdateCallbackFn,
	OnWrapCallbackFn,
	UpdateStateParams,
} from "./CodeBlockAdapter-types";

export const createCodeBlockAdapter = (
	...params: CreateCodeBlockAdapterParams
): CreateCodeBlockAdapterResult => {
	const [
		{ languages = defaultCodeBlockLanguages, themes = defaultCodeBlockThemes },
		{ floatingContainer },
	] = params;

	const internals: CodeBlockInternals = {
		// States
		canInsert: false,
		canWrap: false,
		isActive: false,
		language: "TypeScript",
		lightTheme: "Light+",
		darkTheme: "Dark+",
		// Providers
		plainTextProvider: null,
	};

	// StateListeners
	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> =
		new Set();
	const onCanWrapUpdateListeners: Set<OnCanWrapUpdateCallbackFn> = new Set();
	const onIsActiveUpdateListeners: Set<OnIsActiveUpdateCallbackFn> = new Set();
	const onLanguageUpdateListeners: Set<OnLanguageUpdateCallbackFn> = new Set();
	const onLightThemeUpdateListeners: Set<OnLightThemeUpdateCallbackFn> =
		new Set();
	const onDarkThemeUpdateListeners: Set<OnDarkThemeUpdateCallbackFn> =
		new Set();

	// CommandListeners
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	const onWrapListeners: Set<OnWrapCallbackFn> = new Set();
	const onChangeLanguageListeners: Set<OnChangeLanguageCallbackFn> = new Set();
	const onChangeLightThemeListeners: Set<OnChangeLightThemeCallbackFn> =
		new Set();
	const onChangeDarkThemeListeners: Set<OnChangeDarkThemeCallbackFn> =
		new Set();

	const removePort = createRemovePort();
	const unwrapPort = createUnwrapPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();
	const quickActionsPort = createQuickActionsPort({ floatingContainer });

	const updateState = ({
		canInsert,
		canWrap,
		isActive,
		language,
		lightTheme,
		darkTheme,
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

		if (lightTheme !== undefined) {
			internals.lightTheme = lightTheme;

			for (const listener of onLightThemeUpdateListeners) {
				listener(internals.lightTheme);
			}
		}

		if (darkTheme !== undefined) {
			internals.darkTheme = darkTheme;

			for (const listener of onDarkThemeUpdateListeners) {
				listener(internals.darkTheme);
			}
		}
	};

	const configPort: CodeBlockConfigPort = extendObjectProperties(
		removePort.configPort,
		unwrapPort.configPort,
		currentComponentPort.configPort,
		quickActionsPort.configPort,
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

			onChangeLanguage(callback) {
				onChangeLanguageListeners.add(callback);
				return () => onChangeLanguageListeners.delete(callback);
			},

			onChangeLightTheme(callback) {
				onChangeLightThemeListeners.add(callback);
				return () => onChangeLightThemeListeners.delete(callback);
			},

			onChangeDarkTheme(callback) {
				onChangeDarkThemeListeners.add(callback);
				return () => onChangeDarkThemeListeners.delete(callback);
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
		quickActionsPort.publicPort,
		{
			get languages() {
				return languages;
			},

			get themes() {
				return themes;
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

			get lightTheme() {
				return internals.lightTheme;
			},

			get darkTheme() {
				return internals.darkTheme;
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

			onLightThemeUpdate(callback) {
				onLightThemeUpdateListeners.add(callback);
				return () => onLightThemeUpdateListeners.delete(callback);
			},

			onDarkThemeUpdate(callback) {
				onDarkThemeUpdateListeners.add(callback);
				return () => onDarkThemeUpdateListeners.delete(callback);
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

			changeLightTheme(theme) {
				for (const listener of onChangeLightThemeListeners) {
					listener(theme);
				}
			},

			changeDarkTheme(theme) {
				for (const listener of onChangeDarkThemeListeners) {
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
