import { adapterIds } from "#ports";
import { CodeBlockQuickActions } from "#ui-extensions";
import { createOverlayMount, type OverlayMount } from "../_Utilities";
import {
	defaultCodeBlockLanguages,
	defaultCodeBlockThemes,
} from "./CodeBlockAdapter-default";
import type {
	CodeBlockAdapterConstructorParams,
	CodeBlockEditorPort,
	CodeBlockInsertRequestParams,
	CodeBlockLanguage,
	CodeBlockTheme,
	CodeBlockToolbarButtonState,
	CodeBlockUIPort,
	CodeBlockUpdateDarkThemeFn,
	CodeBlockUpdateIsOpenFn,
	CodeBlockUpdateLanguageFn,
	CodeBlockUpdateLightThemeFn,
	CodeBlockUpdateToolbarButtonFn,
	OnCodeBlockCopyFn,
	OnCodeBlockDarkThemeChangeFn,
	OnCodeBlockInsertRequestFn,
	OnCodeBlockLanguageChangeFn,
	OnCodeBlockLightThemeChangeFn,
	UpdateCodeBlockStateParams,
} from "./CodeBlockAdapter-types";

export class CodeBlockAdapter {
	#overlayMount: OverlayMount;

	#languages: CodeBlockLanguage[];
	#themes: CodeBlockTheme[];

	#toolbarButton: CodeBlockToolbarButtonState = { disabled: true };
	#language = "TypeScript";
	#lightTheme = "Light+";
	#darkTheme = "Dark+";

	#isOpen = false;

	#toolbarButtonListeners: Set<CodeBlockUpdateToolbarButtonFn> = new Set();
	#languageListeners: Set<CodeBlockUpdateLanguageFn> = new Set();
	#lightThemeListeners: Set<CodeBlockUpdateLightThemeFn> = new Set();
	#darkThemeListeners: Set<CodeBlockUpdateDarkThemeFn> = new Set();
	#isOpenListeners: Set<CodeBlockUpdateIsOpenFn> = new Set();

	#onInsertRequestListeners: Set<OnCodeBlockInsertRequestFn> = new Set();
	#onCopyListeners: Set<OnCodeBlockCopyFn> = new Set();
	#onLanguageChangeListeners: Set<OnCodeBlockLanguageChangeFn> = new Set();
	#onLightThemeChangeListeners: Set<OnCodeBlockLightThemeChangeFn> = new Set();
	#onDarkThemeChangeListeners: Set<OnCodeBlockDarkThemeChangeFn> = new Set();

	#uiPort: CodeBlockUIPort | null = null;
	#editorPort: CodeBlockEditorPort | null = null;

	constructor(...params: CodeBlockAdapterConstructorParams) {
		const [
			{
				languages = defaultCodeBlockLanguages,
				themes = defaultCodeBlockThemes,
			},
			{ overlayHost },
		] = params;

		this.#languages = languages;
		this.#themes = themes;

		this.#overlayMount = createOverlayMount({
			overlayHost,
			component: CodeBlockQuickActions,
			props: { uiPort: this.uiPort },
		});
	}

	get id() {
		return adapterIds.codeBlock;
	}

	#updateState({
		toolbarButton,
		language,
		lightTheme,
		darkTheme,
		isOpen,
	}: UpdateCodeBlockStateParams) {
		if (toolbarButton !== undefined) {
			this.#toolbarButton = toolbarButton;

			for (const listener of this.#toolbarButtonListeners) {
				listener(this.#toolbarButton);
			}
		}

		if (language !== undefined) {
			this.#language = language;

			for (const listener of this.#languageListeners) {
				listener(this.#language);
			}
		}

		if (lightTheme !== undefined) {
			this.#lightTheme = lightTheme;

			for (const listener of this.#lightThemeListeners) {
				listener(this.#lightTheme);
			}
		}

		if (darkTheme !== undefined) {
			this.#darkTheme = darkTheme;

			for (const listener of this.#darkThemeListeners) {
				listener(this.#darkTheme);
			}
		}

		if (isOpen !== undefined) {
			this.#isOpen = isOpen;

			for (const listener of this.#isOpenListeners) {
				listener(this.#isOpen);
			}
		}
	}

	get uiPort(): CodeBlockUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get anchoredOverlay() {
				return adapter.#overlayMount.uiOverlayMount;
			},

			get toolbarButton() {
				return adapter.#toolbarButton;
			},

			get languages() {
				return adapter.#languages;
			},

			get themes() {
				return adapter.#themes;
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

			onToolbarButtonUpdate: (callback) => {
				adapter.#toolbarButtonListeners.add(callback);
				return () => adapter.#toolbarButtonListeners.delete(callback);
			},

			onLanguageUpdate: (callback) => {
				adapter.#languageListeners.add(callback);
				return () => adapter.#languageListeners.delete(callback);
			},

			onLightThemeUpdate: (callback) => {
				adapter.#lightThemeListeners.add(callback);
				return () => adapter.#lightThemeListeners.delete(callback);
			},

			onDarkThemeUpdate: (callback) => {
				adapter.#darkThemeListeners.add(callback);
				return () => adapter.#darkThemeListeners.delete(callback);
			},

			onIsOpenUpdate: (callback) => {
				adapter.#isOpenListeners.add(callback);
				return () => adapter.#isOpenListeners.delete(callback);
			},

			emitInsertRequest: (params: CodeBlockInsertRequestParams) => {
				for (const listener of adapter.#onInsertRequestListeners) {
					listener(params);
				}
			},

			emitCopy: () => {
				for (const listener of adapter.#onCopyListeners) {
					listener();
				}
			},

			emitLanguageChange: (language) => {
				for (const listener of adapter.#onLanguageChangeListeners) {
					listener(language);
				}
			},

			emitLightThemeChange: (theme) => {
				for (const listener of adapter.#onLightThemeChangeListeners) {
					listener(theme);
				}
			},

			emitDarkThemeChange: (theme) => {
				for (const listener of adapter.#onDarkThemeChangeListeners) {
					listener(theme);
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): CodeBlockEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			get anchoredOverlay() {
				return adapter.#overlayMount.editorOverlayMount;
			},

			updateState: (params) => adapter.#updateState(params),

			onInsertRequest: (callback) => {
				adapter.#onInsertRequestListeners.add(callback);
				return () => adapter.#onInsertRequestListeners.delete(callback);
			},

			onCopy: (callback) => {
				adapter.#onCopyListeners.add(callback);
				return () => adapter.#onCopyListeners.delete(callback);
			},

			onLanguageChange: (callback) => {
				adapter.#onLanguageChangeListeners.add(callback);
				return () => adapter.#onLanguageChangeListeners.delete(callback);
			},

			onLightThemeChange: (callback) => {
				adapter.#onLightThemeChangeListeners.add(callback);
				return () => adapter.#onLightThemeChangeListeners.delete(callback);
			},

			onDarkThemeChange: (callback) => {
				adapter.#onDarkThemeChangeListeners.add(callback);
				return () => adapter.#onDarkThemeChangeListeners.delete(callback);
			},
		};

		return this.#editorPort;
	}
}
