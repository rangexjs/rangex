import type { OnRemoveCallbackFn, OnUnwrapCallbackFn } from "../_Utilities";
import {
	defaultCodeBlockLanguages,
	defaultCodeBlockThemes,
} from "./CodeBlockAdapter-default";
import type {
	CodeBlockConfigPort,
	CodeBlockLanguage,
	CodeBlockPublicPort,
	CodeBlockTheme,
	ConstructorParams,
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
	PlainTextProviderFn,
	UpdateStateParams,
} from "./CodeBlockAdapter-types";

export class CodeBlockAdapter {
	#floatingEl = document.createElement("div");

	#languages: CodeBlockLanguage[];
	#themes: CodeBlockTheme[];

	#canInsert = false;
	#canWrap = false;
	#isActive = false;
	#language = "TypeScript";
	#lightTheme = "Light+";
	#darkTheme = "Dark+";
	#isOpen = false;

	// ConfigPort
	#onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	#onRemoveListeners: Set<OnRemoveCallbackFn> = new Set();
	#onWrapListeners: Set<OnWrapCallbackFn> = new Set();
	#onUnwrapListeners: Set<OnUnwrapCallbackFn> = new Set();
	#onLanguageListeners: Set<OnLanguageCallbackFn> = new Set();
	#onLightThemeListeners: Set<OnLightThemeCallbackFn> = new Set();
	#onDarkThemeListeners: Set<OnDarkThemeCallbackFn> = new Set();
	#plainTextProvider: PlainTextProviderFn | null = null;

	// PublicPort
	#onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> = new Set();
	#onCanWrapUpdateListeners: Set<OnCanWrapUpdateCallbackFn> = new Set();
	#onIsActiveUpdateListeners: Set<OnIsActiveUpdateCallbackFn> = new Set();
	#onLanguageUpdateListeners: Set<OnLanguageUpdateCallbackFn> = new Set();
	#onLightThemeUpdateListeners: Set<OnLightThemeUpdateCallbackFn> = new Set();
	#onDarkThemeUpdateListeners: Set<OnDarkThemeUpdateCallbackFn> = new Set();
	#onIsOpenUpdateListeners: Set<OnIsOpenUpdateCallbackFn> = new Set();

	#configPort: CodeBlockConfigPort | null = null;
	#publicPort: CodeBlockPublicPort | null = null;

	constructor(...params: ConstructorParams) {
		const [
			{
				languages = defaultCodeBlockLanguages,
				themes = defaultCodeBlockThemes,
			},
			{ floatingContainer },
		] = params;

		floatingContainer.append(this.#floatingEl);

		this.#languages = languages;
		this.#themes = themes;
	}

	#updateState({
		canInsert,
		canWrap,
		isActive,
		language,
		lightTheme,
		darkTheme,
		isOpen,
	}: UpdateStateParams) {
		if (canInsert !== undefined) {
			this.#canInsert = canInsert;

			for (const listener of this.#onCanInsertUpdateListeners) {
				listener(this.#canInsert);
			}
		}

		if (canWrap !== undefined) {
			this.#canWrap = canWrap;

			for (const listener of this.#onCanWrapUpdateListeners) {
				listener(this.#canWrap);
			}
		}

		if (isActive !== undefined) {
			this.#isActive = isActive;

			for (const listener of this.#onIsActiveUpdateListeners) {
				listener(this.#isActive);
			}
		}

		if (language !== undefined) {
			this.#language = language;

			for (const listener of this.#onLanguageUpdateListeners) {
				listener(this.#language);
			}
		}

		if (lightTheme !== undefined) {
			this.#lightTheme = lightTheme;

			for (const listener of this.#onLightThemeUpdateListeners) {
				listener(this.#lightTheme);
			}
		}

		if (darkTheme !== undefined) {
			this.#darkTheme = darkTheme;

			for (const listener of this.#onDarkThemeUpdateListeners) {
				listener(this.#darkTheme);
			}
		}

		if (isOpen !== undefined) {
			this.#isOpen = isOpen;

			for (const listener of this.#onIsOpenUpdateListeners) {
				listener(this.#isOpen);
			}
		}
	}

	get configPort(): CodeBlockConfigPort {
		const adapter = this;

		this.#configPort ??= {
			get floatingEl() {
				return adapter.#floatingEl;
			},

			updateState(params) {
				adapter.#updateState(params);
			},

			onInsert(callback) {
				adapter.#onInsertListeners.add(callback);
				return () => adapter.#onInsertListeners.delete(callback);
			},

			onRemove(callback) {
				adapter.#onRemoveListeners.add(callback);
				return () => adapter.#onRemoveListeners.delete(callback);
			},

			onWrap(callback) {
				adapter.#onWrapListeners.add(callback);
				return () => adapter.#onWrapListeners.delete(callback);
			},

			onUnwrap(callback) {
				adapter.#onUnwrapListeners.add(callback);
				return () => adapter.#onUnwrapListeners.delete(callback);
			},

			onLanguage(callback) {
				adapter.#onLanguageListeners.add(callback);
				return () => adapter.#onLanguageListeners.delete(callback);
			},

			onLightTheme(callback) {
				adapter.#onLightThemeListeners.add(callback);
				return () => adapter.#onLightThemeListeners.delete(callback);
			},

			onDarkTheme(callback) {
				adapter.#onDarkThemeListeners.add(callback);
				return () => adapter.#onDarkThemeListeners.delete(callback);
			},

			registerPlainTextProvider(provider) {
				adapter.#plainTextProvider = provider;
			},
		};

		return this.#configPort;
	}

	get publicPort(): CodeBlockPublicPort {
		const adapter = this;

		this.#publicPort ??= {
			get floatingEl() {
				return adapter.#floatingEl;
			},

			get languages() {
				return adapter.#languages;
			},

			get themes() {
				return adapter.#themes;
			},

			get canInsert() {
				return adapter.#canInsert;
			},

			get canWrap() {
				return adapter.#canWrap;
			},

			get isActive() {
				return adapter.#isActive;
			},

			get language() {
				return adapter.#language;
			},

			get lightTheme() {
				return adapter.#lightTheme;
			},

			get darkTheme() {
				return adapter.#darkTheme;
			},

			get isOpen() {
				return adapter.#isOpen;
			},

			onCanInsertUpdate(callback) {
				adapter.#onCanInsertUpdateListeners.add(callback);
				return () => adapter.#onCanInsertUpdateListeners.delete(callback);
			},

			onCanWrapUpdate(callback) {
				adapter.#onCanWrapUpdateListeners.add(callback);
				return () => adapter.#onCanWrapUpdateListeners.delete(callback);
			},

			onIsActiveUpdate(callback) {
				adapter.#onIsActiveUpdateListeners.add(callback);
				return () => adapter.#onIsActiveUpdateListeners.delete(callback);
			},

			onLanguageUpdate(callback) {
				adapter.#onLanguageUpdateListeners.add(callback);
				return () => adapter.#onLanguageUpdateListeners.delete(callback);
			},

			onLightThemeUpdate(callback) {
				adapter.#onLightThemeUpdateListeners.add(callback);
				return () => adapter.#onLightThemeUpdateListeners.delete(callback);
			},

			onDarkThemeUpdate(callback) {
				adapter.#onDarkThemeUpdateListeners.add(callback);
				return () => adapter.#onDarkThemeUpdateListeners.delete(callback);
			},

			onIsOpenUpdate(callback) {
				adapter.#onIsOpenUpdateListeners.add(callback);
				return () => adapter.#onIsOpenUpdateListeners.delete(callback);
			},

			insert() {
				for (const listener of adapter.#onInsertListeners) {
					listener();
				}
			},

			remove() {
				for (const listener of adapter.#onRemoveListeners) {
					listener();
				}
			},

			wrap() {
				for (const listener of adapter.#onWrapListeners) {
					listener();
				}
			},

			unwrap() {
				for (const listener of adapter.#onUnwrapListeners) {
					listener();
				}
			},

			changeLanguage(language) {
				for (const listener of adapter.#onLanguageListeners) {
					listener(language);
				}
			},

			changeLightTheme(theme) {
				for (const listener of adapter.#onLightThemeListeners) {
					listener(theme);
				}
			},

			changeDarkTheme(theme) {
				for (const listener of adapter.#onDarkThemeListeners) {
					listener(theme);
				}
			},

			getPlainText() {
				if (!adapter.#plainTextProvider) {
					throw new Error("Plain text provider wasn't registered.");
				}

				return adapter.#plainTextProvider();
			},
		};

		return this.#publicPort;
	}
}
