import type {
	highlighterLangs,
	highlighterThemes,
} from "./SyntaxHighlighter-constants";

export type BundledLangKeys = (typeof highlighterLangs)[number];

export type BundledThemeKeys = (typeof highlighterThemes)[number];

export interface ThemeBackgrounds extends Record<BundledThemeKeys, string> {}

export type TokenColors = Record<BundledThemeKeys, string>;

interface ThemedChars {
	colors: TokenColors;
	content: string;
}

export type ThemedCodeLine = ThemedChars[];

export type ThemedCodeLines = ThemedCodeLine[];

export interface HighlightInfo {
	backgrounds: ThemeBackgrounds;
	codeLines: ThemedCodeLines;
}

export interface GetHighlightInfoParams {
	lines: string[];
	lang: BundledLangKeys;
}

export type GetHighlightInfoResult = Promise<HighlightInfo>;
