import type { BundledLangKeys, DualTheme } from "#libs";

export interface CreateHighlightedCodeParams {
	code: string;
	lang: BundledLangKeys;
	theme: DualTheme;
}

export type CreateHighlightedCodeResult = Promise<HTMLPreElement>;
