import type { BundledLangKeys, DualTheme } from "../../../../Libs";

export interface CreateHighlightedCodeParams {
	code: string;
	lang: BundledLangKeys;
	theme: DualTheme;
}

export type CreateHighlightedCodeResult = Promise<HTMLPreElement>;
