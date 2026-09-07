import { extendObjectProperties } from "#utilities";
import { createRemovePort, createUnwrapPort } from "../_Utilities";
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
	OnDarkThemeCallbackFn,
	OnDarkThemeUpdateCallbackFn,
	OnInsertCallbackFn,
	OnIsActiveUpdateCallbackFn,
	OnIsOpenUpdateCallbackFn,
	OnLanguageCallbackFn,
	OnLanguageUpdateCallbackFn,
	OnLightThemeCallbackFn,
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

	const floatingEl = document.createElement("div");
	floatingContainer.append(floatingEl);

	const internals: CodeBlockInternals = {
		canInsert: false,
		canWrap: false,
		isActive: false,
		language: "TypeScript",
		lightTheme: "Light+",
		darkTheme: "Dark+",
		isOpen: false,
		plainTextProvider: null,
	};

	// ConfigPort
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	const onWrapListeners: Set<OnWrapCallbackFn> = new Set();
	const onLanguageListeners: Set<OnLanguageCallbackFn> = new Set();
	const onLightThemeListeners: Set<OnLightThemeCallbackFn> = new Set();
	const onDarkThemeListeners: Set<OnDarkThemeCallbackFn> = new Set();

	// PublicPort
	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> =
		new Set();
	const onCanWrapUpdateListeners: Set<OnCanWrapUpdateCallbackFn> = new Set();
	const onIsActiveUpdateListeners: Set<OnIsActiveUpdateCallbackFn> = new Set();
	const onLanguageUpdateListeners: Set<OnLanguageUpdateCallbackFn> = new Set();
	const onLightThemeUpdateListeners: Set<OnLightThemeUpdateCallbackFn> =
		new Set();
	const onDarkThemeUpdateListeners: Set<OnDarkThemeUpdateCallbackFn> =
		new Set();
	const onIsOpenUpdateListeners: Set<OnIsOpenUpdateCallbackFn> = new Set();

	const removePort = createRemovePort();
	const unwrapPort = createUnwrapPort();

	const updateState = ({
		canInsert,
		canWrap,
		isActive,
		language,
		lightTheme,
		darkTheme,
		isOpen,
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

		if (isOpen !== undefined) {
			internals.isOpen = isOpen;

			for (const listener of onIsOpenUpdateListeners) {
				listener(internals.isOpen);
			}
		}
	};

	const configPort: CodeBlockConfigPort = extendObjectProperties(
		removePort.configPort,
		unwrapPort.configPort,
		{
			get floatingEl() {
				return floatingEl;
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

			onLanguage(callback) {
				onLanguageListeners.add(callback);
				return () => onLanguageListeners.delete(callback);
			},

			onLightTheme(callback) {
				onLightThemeListeners.add(callback);
				return () => onLightThemeListeners.delete(callback);
			},

			onDarkTheme(callback) {
				onDarkThemeListeners.add(callback);
				return () => onDarkThemeListeners.delete(callback);
			},

			registerPlainTextProvider(provider) {
				internals.plainTextProvider = provider;
			},
		} satisfies CodeBlockConfigPortProps,
	);

	const publicPort: CodeBlockPublicPort = extendObjectProperties(
		removePort.publicPort,
		unwrapPort.publicPort,
		{
			get floatingEl() {
				return floatingEl;
			},

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

			get isOpen() {
				return internals.isOpen;
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

			onIsOpenUpdate(callback) {
				onIsOpenUpdateListeners.add(callback);
				return () => onIsOpenUpdateListeners.delete(callback);
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
				for (const listener of onLanguageListeners) {
					listener(language);
				}
			},

			changeLightTheme(theme) {
				for (const listener of onLightThemeListeners) {
					listener(theme);
				}
			},

			changeDarkTheme(theme) {
				for (const listener of onDarkThemeListeners) {
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
