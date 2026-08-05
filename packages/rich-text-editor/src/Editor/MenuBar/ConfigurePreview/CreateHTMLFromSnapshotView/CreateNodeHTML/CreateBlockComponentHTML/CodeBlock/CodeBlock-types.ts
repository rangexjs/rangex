import type { DualTheme, ThemeBackgrounds, ThemedCodeLines } from "#libs";

export interface ApplyTokenSpansParams {
	codeBlockEl: HTMLElement;
	contentLineEls: Element[];
	backgrounds: ThemeBackgrounds;
	codeLines: ThemedCodeLines;
	theme: DualTheme;
}

export interface ResolveCodeBlockParams {
	codeBlockEl: HTMLElement;
	customStorage: unknown;
}

export type ResolveCodeBlockResult = Promise<void>;
