import type {
	highlighterLangs,
	highlighterThemes,
} from "./SyntaxHighlighter-constants";

export type BundledLangKeys = (typeof highlighterLangs)[number];

export type BundledThemeKeys = (typeof highlighterThemes)[number];

export interface DualTheme {
	light: BundledThemeKeys;
	dark: BundledThemeKeys;
}

export interface ThemeBackgrounds extends Record<BundledThemeKeys, string> {}

export interface ThemeForegrounds extends Record<BundledThemeKeys, string> {}

export type TokenColors = Record<BundledThemeKeys, string>;

interface ThemedChars {
	colors: TokenColors;
	content: string;
}

export type ThemedCodeLine = ThemedChars[];

export type ThemedCodeLines = ThemedCodeLine[];

export interface HighlightInfo {
	backgrounds: ThemeBackgrounds;
	foregrounds: ThemeForegrounds;
	codeLines: ThemedCodeLines;
}

export interface GetHighlightInfoParams {
	lines: string[];
	lang: BundledLangKeys;
}

export type GetHighlightInfoResult = Promise<HighlightInfo>;

export interface GetHighlightedHTMLParams {
	code: string;
	lang: BundledLangKeys;
	theme: DualTheme;
}

export type GetHighlightedHTMLResult = Promise<string>;
