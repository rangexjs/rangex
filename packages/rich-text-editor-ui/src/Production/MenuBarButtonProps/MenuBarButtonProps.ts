// Theme
export type ThemeValue = "light" | "dark" | "system";

export interface ThemeMenuBarButtonState {
	value: ThemeValue;
}

// Template
export type TemplateValue = "default" | "document" | "paginated";

export interface TemplateMenuBarButtonState {
	value: TemplateValue;
}

// Vim mode
export interface VimModeMenuBarButtonState {
	enabled: boolean;
}

// Language
export interface LanguageMenuBarButtonState {
	value: string; // BCP 47 tag, e.g. "en", "de"
}

// Preview
export interface PreviewContent {
	getRendered: () => Promise<HTMLElement>;
	getHtml: () => Promise<HTMLElement>;
	getJson: () => Promise<HTMLElement>;
	getSnapshot: () => Promise<HTMLElement>;
}

export interface PreviewMenuBarButtonState {
	content: PreviewContent | null;
}
