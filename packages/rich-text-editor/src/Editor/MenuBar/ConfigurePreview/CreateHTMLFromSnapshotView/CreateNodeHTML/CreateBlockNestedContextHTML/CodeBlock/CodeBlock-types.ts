import type {
	DualTheme,
	ThemeBackgrounds,
	ThemedCodeLines,
} from "../../../../../../Libs";

export interface ApplyTokenSpansParams {
	codeBlockEl: HTMLElement;
	contentLineEls: Element[];
	backgrounds: ThemeBackgrounds;
	codeLines: ThemedCodeLines;
	theme: DualTheme;
}

export interface HighlightCodeBlockParams {
	codeBlockEl: HTMLElement;
	customStorage: unknown;
}

export type HighlightCodeBlockResult = Promise<void>;
