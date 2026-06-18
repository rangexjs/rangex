import { assertNever } from "../../ErrorHandling";
import type {
	CodeBlockLanguage,
	CodeBlockTheme,
} from "../../ToolbarButtonProps";
import type {
	CodeBlockListenerOption,
	CodeBlockPopover,
	CodeBlockUpdateListenerParams,
	OnCopyFn,
	OnDarkThemeChangeFn,
	OnLanguageChangeFn,
	OnLightThemeChangeFn,
	UpdateCodeBlockPopoverStateParams,
	UpdateDarkThemeFn,
	UpdateLanguageFn,
	UpdateLightThemeFn,
} from "./CodeBlockPopoverController-types";

export class CodeBlockPopoverController {
	#popover: HTMLDivElement | null = null;
	#language: CodeBlockLanguage = "TypeScript";
	#lightTheme: CodeBlockTheme = "light-plus";
	#darkTheme: CodeBlockTheme = "dark-plus";

	#languageListeners: Set<UpdateLanguageFn> = new Set();
	#lightThemeListeners: Set<UpdateLightThemeFn> = new Set();
	#darkThemeListeners: Set<UpdateDarkThemeFn> = new Set();

	#onCopyListeners: Set<OnCopyFn> = new Set();
	#onLanguageChangeListeners: Set<OnLanguageChangeFn> = new Set();
	#onLightThemeChangeListeners: Set<OnLightThemeChangeFn> = new Set();
	#onDarkThemeChangeListeners: Set<OnDarkThemeChangeFn> = new Set();

	get language() {
		return this.#language;
	}

	get lightTheme() {
		return this.#lightTheme;
	}

	get darkTheme() {
		return this.#darkTheme;
	}

	#updateListener({
		type,
		callback,
		operation,
	}: CodeBlockUpdateListenerParams) {
		if (type === "language") {
			this.#languageListeners[operation](callback);
			return;
		}

		if (type === "lightTheme") {
			this.#lightThemeListeners[operation](callback);
			return;
		}

		if (type === "darkTheme") {
			this.#darkThemeListeners[operation](callback);
			return;
		}

		assertNever(type);
	}

	subscribe(params: CodeBlockListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: CodeBlockListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	emitCopy() {
		for (const listener of this.#onCopyListeners) {
			listener();
		}
	}

	emitLanguageChange(language: CodeBlockLanguage) {
		for (const listener of this.#onLanguageChangeListeners) {
			listener(language);
		}
	}

	emitLightThemeChange(theme: CodeBlockTheme) {
		for (const listener of this.#onLightThemeChangeListeners) {
			listener(theme);
		}
	}

	emitDarkThemeChange(theme: CodeBlockTheme) {
		for (const listener of this.#onDarkThemeChangeListeners) {
			listener(theme);
		}
	}

	updateState({
		language,
		lightTheme,
		darkTheme,
	}: UpdateCodeBlockPopoverStateParams) {
		if (language) {
			this.#language = language;

			for (const listener of this.#languageListeners) {
				listener(this.#language);
			}
		}

		if (lightTheme) {
			this.#lightTheme = lightTheme;

			for (const listener of this.#lightThemeListeners) {
				listener(this.#lightTheme);
			}
		}

		if (darkTheme) {
			this.#darkTheme = darkTheme;

			for (const listener of this.#darkThemeListeners) {
				listener(this.#darkTheme);
			}
		}
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): CodeBlockPopover {
		const controller = this;

		return {
			get popover() {
				if (!controller.#popover) {
					throw new Error("PopoverNode shouldn't be null.");
				}

				return controller.#popover;
			},

			updateState: (params) => this.updateState(params),

			onCopy: (callback) => {
				this.#onCopyListeners.add(callback);
				return () => this.#onCopyListeners.delete(callback);
			},

			onLanguageChange: (callback) => {
				this.#onLanguageChangeListeners.add(callback);
				return () => this.#onLanguageChangeListeners.delete(callback);
			},

			onLightThemeChange: (callback) => {
				this.#onLightThemeChangeListeners.add(callback);
				return () => this.#onLightThemeChangeListeners.delete(callback);
			},

			onDarkThemeChange: (callback) => {
				this.#onDarkThemeChangeListeners.add(callback);
				return () => this.#onDarkThemeChangeListeners.delete(callback);
			},
		};
	}
}
