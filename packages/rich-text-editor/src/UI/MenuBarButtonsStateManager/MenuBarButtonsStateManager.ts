import { assertNever } from "#ports";
import { menuBarButtonsName } from "../Constants";
import type {
	LanguageMenuBarButtonState,
	PreviewMenuBarButtonState,
	TemplateMenuBarButtonState,
	ThemeMenuBarButtonState,
	VimModeMenuBarButtonState,
} from "../MenuBarButtonProps";
import type {
	ListenerOption,
	UpdateLanguageStateFn,
	UpdateListenerParams,
	UpdateMenuBarButtonsStateParams,
	UpdatePreviewStateFn,
	UpdateTemplateStateFn,
	UpdateThemeStateFn,
	UpdateVimModeStateFn,
} from "./MenuBarButtonsStateManager-types";

export class MenuBarButtonsStateManager {
	#theme: ThemeMenuBarButtonState = { value: "system" };
	#template: TemplateMenuBarButtonState = { value: "default" };
	#vimMode: VimModeMenuBarButtonState = { enabled: false };
	#language: LanguageMenuBarButtonState = { value: "en" };
	#preview: PreviewMenuBarButtonState = { content: null };

	#themeListeners: Set<UpdateThemeStateFn> = new Set();
	#templateListeners: Set<UpdateTemplateStateFn> = new Set();
	#vimModeListeners: Set<UpdateVimModeStateFn> = new Set();
	#languageListeners: Set<UpdateLanguageStateFn> = new Set();
	#previewListeners: Set<UpdatePreviewStateFn> = new Set();

	get theme() {
		return this.#theme;
	}

	get template() {
		return this.#template;
	}

	get vimMode() {
		return this.#vimMode;
	}

	get language() {
		return this.#language;
	}

	get preview() {
		return this.#preview;
	}

	#updateListener({ type, callback, operation }: UpdateListenerParams) {
		if (type === menuBarButtonsName.theme) {
			this.#themeListeners[operation](callback as UpdateThemeStateFn);
			return;
		}

		if (type === menuBarButtonsName.template) {
			this.#templateListeners[operation](callback as UpdateTemplateStateFn);
			return;
		}

		if (type === menuBarButtonsName.vimMode) {
			this.#vimModeListeners[operation](callback as UpdateVimModeStateFn);
			return;
		}

		if (type === menuBarButtonsName.language) {
			this.#languageListeners[operation](callback as UpdateLanguageStateFn);
			return;
		}

		if (type === menuBarButtonsName.preview) {
			this.#previewListeners[operation](callback as UpdatePreviewStateFn);
			return;
		}

		assertNever(type);
	}

	subscribe(params: ListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: ListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	updateState({
		theme,
		template,
		vimMode,
		language,
		preview,
	}: UpdateMenuBarButtonsStateParams) {
		if (theme) {
			this.#theme = { ...this.#theme, ...theme };
			for (const listener of this.#themeListeners) {
				listener(this.#theme);
			}
		}

		if (template) {
			this.#template = { ...this.#template, ...template };
			for (const listener of this.#templateListeners) {
				listener(this.#template);
			}
		}

		if (vimMode) {
			this.#vimMode = { ...this.#vimMode, ...vimMode };
			for (const listener of this.#vimModeListeners) {
				listener(this.#vimMode);
			}
		}

		if (language) {
			this.#language = { ...this.#language, ...language };
			for (const listener of this.#languageListeners) {
				listener(this.#language);
			}
		}

		if (preview) {
			this.#preview = { ...this.#preview, ...preview };
			for (const listener of this.#previewListeners) {
				listener(this.#preview);
			}
		}
	}
}
